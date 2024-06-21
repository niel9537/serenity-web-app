import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import LineChart from '../components/LineChart';
import { useRouter } from 'next/router';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchTransactions(); // Fetch transactions when user is authenticated
    } else {
      router.push('/login'); // Redirect to login if user is not authenticated
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transaction-paid');
      const data = await response.json();
      setTransactions(data.transaksi);
      calculateTotalPaidAmount(data.transaksi); // Calculate total paid amount
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateTotalPaidAmount = (transactions) => {
    const currentYear = new Date().getFullYear();
    const filteredTransactions = transactions.filter(transaction =>
      new Date(transaction.transactionDate).getFullYear() === currentYear
    );
    const totalAmount = filteredTransactions.reduce((total, transaction) => total + transaction.totalPrice, 0);
    setTotalPaidAmount(totalAmount);
  };

  if (error) {
    return <div>Error: {error}</div>; // Render error message
  }

  if (!user) {
    return <div>Loading...</div>; // or a proper loading indicator
  }

  return (
    <Layout>
      <div className='py-8'>
        <h1 className="pl-3 text-3xl font-bold text-rose-400">Beranda</h1>
        <p className="pl-3">Welcome, {user.username}!</p>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="ml-3 my-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Paid Amount in Current Year */}
            <div className="bg-rose-500 p-4 shadow rounded-md flex items-center justify-center">
              <svg
                className="h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="ml-4">
                <h2 className="text-lg text-white font-semibold mb-2">Jumlah Pendapatan Tahun Ini</h2>
                <p className="text-3xl text-white">Rp {totalPaidAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Unique Customers Count */}
            <div className="bg-rose-500 p-4 shadow rounded-md flex items-center justify-center">
              <svg
                className="h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="ml-4">
                <h2 className="text-lg text-white font-semibold mb-2">Jumlah Pelanggan</h2>
                <p className="text-3xl text-white">{new Set(transactions.map(trans => trans.customerId)).size}</p>
              </div>
            </div>

            {/* Total Products Sold */}
            <div className="bg-rose-500 p-4 shadow rounded-md flex items-center justify-center">
              <svg
                className="h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2A2 2 0 0 0 16 0H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4l3 3 3-3h4a2 2 0 0 0 2-2V2z" />
              </svg>
              <div className="ml-4">
                <h2 className="text-lg text-white font-semibold mb-2">Jumlah Produk Terjual</h2>
                <p className="text-3xl text-white">
                  {transactions.reduce((total, trans) => total + trans.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 shadow rounded-md">
            {/* LineChart */}
            <LineChart transactions={transactions} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
