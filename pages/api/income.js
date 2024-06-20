// pages/api/income.js

import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { searchTerm, page, pageSize } = req.query;

    try {
      const pageInt = parseInt(page, 10) || 1;
      const pageSizeInt = parseInt(pageSize, 10) || 10;
      const skip = (pageInt - 1) * pageSizeInt;

      let where = {};

      if (searchTerm) {
        where = {
          OR: [
            { id: parseInt(searchTerm, 10) || undefined },
            { idProduct: parseInt(searchTerm, 10) || undefined },
            { status: { contains: searchTerm, mode: 'insensitive' } },
          ],
        };
      }

      const transactions = await prisma.transaction.findMany({
        where,
        skip,
        take: pageSizeInt,
      });

      const totalCount = await prisma.transaction.count({ where });

      // Fetch customer names
      const customerIds = transactions.map((transaction) => transaction.idCustomer);
      const customers = await prisma.user.findMany({
        where: {
          id: {
            in: customerIds,
          },
        },
      });

      // Fetch product names
      const productIds = transactions.map((transaction) => transaction.idProduct);
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Map customer and product names to transactions
      const transactionsWithNames = transactions.map((transaction) => {
        const customer = customers.find((c) => c.id === transaction.idCustomer);
        const product = products.find((p) => p.id === transaction.idProduct);

        return {
          ...transaction,
          customerName: customer ? customer.name : 'Unknown Customer',
          productName: product ? product.name : 'Unknown Product',
        };
      });

      res.status(200).json({ transactions: transactionsWithNames, totalCount });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
