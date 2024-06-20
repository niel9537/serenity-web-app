import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch transactions with status 'paid'
      const transactions = await prisma.transaction.findMany({
        where: {
          status: 'paid',
        },
      });

      // Fetch product information for each transaction
      const transactionsWithProducts = await Promise.all(
        transactions.map(async (transaction) => {
          const product = await prisma.product.findUnique({
            where: {
              id: transaction.idProduct,
            },
          });

          // Return transaction with related product information
          return {
            ...transaction,
            product: product || null, // Include product or null if not found
          };
        })
      );

      res.status(200).json({ transaksi: transactionsWithProducts });
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil daftar transaksi:', error);
      res.status(500).json({ error: 'Gagal mengambil daftar transaksi' });
    }
  } else {
    res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
}
