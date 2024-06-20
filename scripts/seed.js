// scripts/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Hapus semua data pengguna
    await prisma.user.deleteMany({});
    // Hapus semua data produk
    await prisma.product.deleteMany({});

    await prisma.user.createMany({
      data: [
        {
          name: 'Admin',
          email: 'admin@gmail.com',
          username: 'admin',
          password: 'adminpassword',
          role: 'admin',
        },
        {
          name: 'Vincent',
          email: 'vincent@gmail.com',
          username: 'customer',
          password: 'customerpassword',
          role: 'customer',
        },
      ],
    });

    await prisma.product.createMany({
      data: [
        {
          name: 'Product 1',
          type: 'Cream',
          price: 25.99,
          brand: 'Brand A',
          stock: 100,
          expiredDate: '2024-12-31',
          imageUrl: '/images/product1.jpg',
        },
        {
          name: 'Product 2',
          type: 'Lotion',
          price: 19.99,
          brand: 'Brand B',
          stock: 80,
          expiredDate: '2024-11-30',
          imageUrl: '/images/product2.jpg',
        },
        {
          name: 'Product 3',
          type: 'Serum',
          price: 29.99,
          brand: 'Brand C',
          stock: 50,
          expiredDate: '2025-01-31',
          imageUrl: '/images/product3.jpg',
        },
        {
          name: 'Product 4',
          type: 'Toner',
          price: 14.99,
          brand: 'Brand D',
          stock: 120,
          expiredDate: '2024-10-31',
          imageUrl: '/images/product4.jpg',
        },
        {
          name: 'Product 5',
          type: 'Moisturizer',
          price: 22.99,
          brand: 'Brand E',
          stock: 90,
          expiredDate: '2024-09-30',
          imageUrl: '/images/product5.jpg',
        },
        {
          name: 'Product 6',
          type: 'Face Wash',
          price: 12.99,
          brand: 'Brand F',
          stock: 110,
          expiredDate: '2025-03-31',
          imageUrl: '/images/product6.jpg',
        },
        {
          name: 'Product 7',
          type: 'Sunscreen',
          price: 18.99,
          brand: 'Brand G',
          stock: 70,
          expiredDate: '2025-02-28',
          imageUrl: '/images/product7.jpg',
        },
        {
          name: 'Product 8',
          type: 'Essence',
          price: 26.99,
          brand: 'Brand H',
          stock: 60,
          expiredDate: '2024-08-31',
          imageUrl: '/images/product8.jpg',
        },
        {
          name: 'Product 9',
          type: 'Sheet Mask',
          price: 9.99,
          brand: 'Brand I',
          stock: 200,
          expiredDate: '2024-07-31',
          imageUrl: '/images/product9.jpg',
        },
        {
          name: 'Product 10',
          type: 'Eye Cream',
          price: 27.99,
          brand: 'Brand J',
          stock: 40,
          expiredDate: '2025-05-31',
          imageUrl: '/images/product10.jpg',
        },
        {
          name: 'Product 11',
          type: 'Exfoliator',
          price: 16.99,
          brand: 'Brand K',
          stock: 85,
          expiredDate: '2024-11-15',
          imageUrl: '/images/product11.jpg',
        },
        {
          name: 'Product 12',
          type: 'Lip Balm',
          price: 7.99,
          brand: 'Brand L',
          stock: 150,
          expiredDate: '2024-12-25',
          imageUrl: '/images/product12.jpg',
        },
      ],
    });

    console.log('Seeding successful.');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
