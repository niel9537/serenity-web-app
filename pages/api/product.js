import { v4 as uuidv4 } from 'uuid';
import prisma from '../../lib/prisma'; // Sesuaikan dengan struktur proyek Anda

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    // Menghandle permintaan GET untuk mengambil produk dengan pencarian dan penyebaran halaman
    const { searchTerm, page, pageSize } = req.query;

    try {
      const pageInt = parseInt(page, 10) || 1;
      const pageSizeInt = parseInt(pageSize, 10) || 10;
      const skip = (pageInt - 1) * pageSizeInt;

      const where = searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { type: { contains: searchTerm, mode: 'insensitive' } },
              { brand: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {};

      const products = await prisma.product.findMany({
        where,
        skip,
        take: pageSizeInt,
      });

      const totalCount = await prisma.product.count({ where });

      res.status(200).json({ products, totalCount });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Gagal mengambil produk' });
    }
  } else if (method === 'POST') {
    // Menghandle permintaan POST untuk membuat produk baru
    const { name, type, brand, price, stock, expiredDate, imageUrl } = req.body;
    const priceFloat = parseFloat(price);
    const stockFloat = parseFloat(stock);

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          type,
          brand,
          price: priceFloat,
          stock: stockFloat,
          expiredDate,
          imageUrl,
        },
      });
      res.status(201).json({ message: 'Produk berhasil dibuat', product: newProduct });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Gagal membuat produk' });
    }
  } else if (method === 'PUT') {
    // Menghandle permintaan PUT untuk memperbarui produk yang ada
    const { id, name, type, brand, price, stock, expiredDate, imageUrl } = req.body;
    const priceFloat = parseFloat(price);
    const stockFloat = parseFloat(stock);
    console.log(id)
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: { name, type, brand, price: priceFloat, stock: stockFloat, expiredDate, imageUrl },
      });

      res.status(200).json({ message: 'Produk berhasil diperbarui', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Gagal memperbarui produk' });
    }
  } else if (method === 'DELETE') {
    // Menghandle permintaan DELETE untuk menghapus produk
    const productId = req.query.id;

    try {
      await prisma.product.delete({ where: { id: parseInt(productId, 10) } });
      res.status(200).json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Gagal menghapus produk' });
    }
  } else {
    res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
}
