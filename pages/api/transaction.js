import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle POST request to create a new transaction
    const { idCustomer, idProduct, quantity, price } = req.body;

    try {
      // Convert idCustomer to an integer
      const customerId = parseInt(idCustomer, 10);

      // Validate if customerId is valid
      if (isNaN(customerId) || customerId <= 0) {
        return res.status(400).json({ error: 'ID pelanggan tidak valid' });
      }

      // Validate idProduct, quantity, and price
      if (!idProduct || quantity <= 0 || price <= 0) {
        return res.status(400).json({ error: 'ID produk, kuantitas, atau harga tidak valid' });
      }

      // Check if the product exists and has enough stock
      const product = await prisma.product.findUnique({
        where: { id: idProduct },
      });

      if (!product) {
        return res.status(400).json({ error: 'Produk tidak ditemukan' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ error: 'Stok tidak mencukupi' });
      }

      // Calculate total price
      const totalPrice = quantity * price;

      // Create transaction record
      const newTransaction = await prisma.transaction.create({
        data: {
          idCustomer: customerId,
          idProduct,
          quantity,
          price,
          totalPrice,
          status: 'pending',
        },
      });

      res.status(201).json({ 
        message: 'Transaksi berhasil dibuat', 
        transaksi: newTransaction 
      });
    } catch (error) {
      console.error('Terjadi kesalahan saat membuat transaksi:', error);

      // Handle errors
      if (error.code === 'P2003') {
        res.status(400).json({ error: 'ID pelanggan atau produk tidak valid' });
      } else {
        res.status(500).json({ error: 'Gagal membuat transaksi' });
      }
    }
  } else  if (req.method === 'GET') {
    const { idCustomer, status } = req.query;

    try {
      const customerId = parseInt(idCustomer, 10);

      if (isNaN(customerId) || customerId <= 0) {
        return res.status(400).json({ error: 'ID pelanggan tidak valid' });
      }

      // Fetch transactions based on idCustomer and status
      const transactions = await prisma.transaction.findMany({
        where: {
          idCustomer: customerId,
          status: status,
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
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete a transaction
    const { id } = req.query;

    try {
      // Convert id to an integer
      const transactionId = parseInt(id, 10);

      // Validate if transactionId is not valid
      if (isNaN(transactionId) || transactionId <= 0) {
        return res.status(400).json({ error: 'ID transaksi tidak valid' });
      }

      // Fetch the transaction to check conditions for deletion
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
      }

      // Fetch related product information manually
      const product = await prisma.product.findUnique({
        where: { id: transaction.idProduct },
      });

      // Implement your condition here, e.g., allow deletion only if status is 'pending'
      if (transaction.status !== 'pending') {
        return res.status(400).json({ error: 'Tidak dapat menghapus transaksi dengan status selain pending' });
      }

      // Delete the transaction
      await prisma.transaction.delete({
        where: { id: transactionId },
      });

      // Optionally, update the product stock if needed
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock + transaction.quantity },
        });
      }

      res.status(200).json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus transaksi:', error);
      res.status(500).json({ error: 'Gagal menghapus transaksi' });
    }
  } else if (req.method === 'PUT') {
    const { idCustomer, newStatus } = req.body;

    try {
      // Convert idCustomer to an integer
      const customerId = parseInt(idCustomer, 10);

      // Validate if customerId is not valid
      if (isNaN(customerId) || customerId <= 0) {
        return res.status(400).json({ error: 'ID pelanggan tidak valid' });
      }

      // Fetch transactions to update based on idCustomer
      const transactionsToUpdate = await prisma.transaction.findMany({
        where: {
          idCustomer: customerId,
          status: 'pending', // Only update transactions with status 'pending'
        },
      });

      // Update each transaction with the newStatus
      const updatedTransactions = await Promise.all(
        transactionsToUpdate.map(async (transaction) => {
          const updatedTransaction = await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: newStatus,
            },
          });
          return updatedTransaction;
        })
      );

      res.status(200).json({ 
        message: 'Status transaksi berhasil diperbarui', 
        transaksi: updatedTransactions 
      });
    } catch (error) {
      console.error('Terjadi kesalahan saat memperbarui status transaksi:', error);
      res.status(500).json({ error: 'Gagal memperbarui status transaksi' });
    }
  } else {
    res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
}
