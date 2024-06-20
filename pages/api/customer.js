import { v4 as uuidv4 } from 'uuid';
import prisma from '../../lib/prisma'; // Adjust the import according to your project structure

export default async function handler(req, res) {
  const { method } = req;
  const customerId = parseInt(req.query.id, 10); // Use req.query.id to get the customer ID from the URL

  if (method === 'GET') {
    const { searchTerm, page, pageSize } = req.query;

    try {
      const pageInt = parseInt(page, 10) || 1;
      const pageSizeInt = parseInt(pageSize, 10) || 10;
      const skip = (pageInt - 1) * pageSizeInt;

      const where = searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { username: { contains: searchTerm, mode: 'insensitive' } },
              { email: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {};

      const customers = await prisma.user.findMany({
        where,
        skip,
        take: pageSizeInt,
      });

      const totalCount = await prisma.user.count({ where });

      res.status(200).json({ customers, totalCount });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  } else if (method === 'POST') {
    // Handle POST request to create a new customer
    const { username, password, name, email } = req.body;
    try {
      const newCustomer = await prisma.user.create({
        data: {
          username,
          password, // Assuming password is already hashed
          name,
          email,
          role: 'customer',
        },
      });
      res.status(201).json({ message: 'Pelanggan berhasil dibuat', customer: newCustomer });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Gagal membuat pelanggan' });
    }
  } else if (method === 'PUT') {
    // Handle PUT request to update a customer
    const { username, password, name, email } = req.body;
    try {
      // Validate if the user exists and is a customer
      const existingCustomer = await prisma.user.findUnique({
        where: {
          id: customerId,
          role: 'customer', // Ensure the user is a customer
        },
      });

      if (!existingCustomer) {
        return res.status(404).json({ error: 'Pelanggan tidak ditemukan' });
      }

      // Update the customer
      const updatedCustomer = await prisma.user.update({
        where: { id: customerId },
        data: {
          username,
          password, // Assuming password is already hashed
          name,
          email,
        },
      });

      res.status(200).json({ message: 'Pelanggan berhasil diperbarui', customer: updatedCustomer });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Gagal memperbarui pelanggan' });
    }
  } else if (method === 'DELETE') {
    // Handle DELETE request to delete a customer
    try {
      // Validate if the user exists and is a customer
      const existingCustomer = await prisma.user.findUnique({
        where: {
          id: customerId,
          role: 'customer', // Ensure the user is a customer
        },
      });

      if (!existingCustomer) {
        return res.status(404).json({ error: 'Pelanggan tidak ditemukan' });
      }

      // Delete the customer
      await prisma.user.delete({
        where: { id: customerId },
      });

      res.status(200).json({ message: 'Pelanggan berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Gagal menghapus pelanggan' });
    }
  } else {
    res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
}
