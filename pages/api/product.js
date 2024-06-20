import { v4 as uuidv4 } from 'uuid';
import prisma from '../../lib/prisma'; // Adjust the import according to your project structure

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    // Handle GET request to fetch products with search and pagination
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
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (method === 'POST') {
    // Handle POST request to create a new product
    const { name, type, brand, price } = req.body;
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          type,
          brand,
          price,
        },
      });
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else if (method === 'PUT') {
    // Handle PUT request to update a product
    const { productId, name, type, brand, price } = req.body;
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          type,
          brand,
          price,
        },
      });

      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else if (method === 'DELETE') {
    // Handle DELETE request to delete a product
    const { productId } = req.query;
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(productId, 10) },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await prisma.product.delete({
        where: { id: parseInt(productId, 10) },
      });

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
