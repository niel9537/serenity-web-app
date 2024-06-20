// pages/api/login.js

import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { username, password } = req.body;

  try {
    const users = await prisma.user.findMany({
      where: {
        username,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ error: 'Username tidak ditemukan' });
    }

    const user = users[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Password salah' });
    }

    // Assuming you have JWT authentication, generate token here
    // Example: const token = generateAuthToken(user);

    if (user.role === 'admin') {
      res.status(200).json({ role: 'admin', user });
    } else {
      res.status(200).json({ role: 'customer', user });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in: ' + error.message });
  }
}
