// pages/login.js

import { useState } from 'react';
import prisma from '../lib/prisma'; // assuming you've set up prisma client
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const router = useRouter();
   const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error);
        return;
      }

      const data = await response.json();
      // Save session data (user and role) in localStorage or sessionStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('id', JSON.stringify(data.id));
      localStorage.setItem('role', data.role);
      if (data.role === 'admin') {
        router.push('/admin'); // Redirect to admin page
      } else {
        // Handle customer login (optional)
        alert('Customer login successful');
        router.push('/customer');
        
        // Example: router.push('/customer');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in: ' + error.message);
    }
  };


  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center max-w-4xl m-auto">
        <h1 className="text-4xl font-semibold max-w-xl text-center">
          Selamat Datang di Serenity Skin
        </h1>
        <p className="font-medium my-4">Akun dibutuhkan untuk bisa akses</p>
        <label
          htmlFor="Username"
          className="relative py-1 px-3 my-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="text"
            id="Username"
            className="peer text-sm text-center border-none bg-transparent placeholder-transparent placeholder:text-center  focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="pointer-events-none  absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Username
          </span>
        </label>
        <label
          htmlFor="Password"
          className="relative py-1 px-3 my-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="password"
            id="Password"
            className="peer text-sm text-center border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Password
          </span>
        </label>
        <button
          className="group relative inline-flex items-center overflow-hidden rounded bg-rose-400 px-8 py-2 text-white focus:outline-none focus:ring active:bg-rose-300"
          onClick={handleLogin}
        >
          <span className="absolute -end-full transition-all group-hover:end-4">
            <svg
              className="size-5 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <span className="text-sm font-medium transition-all group-hover:me-4"> Masuk </span>
        </button>
      </div>
    </>
  );
}
