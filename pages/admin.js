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
      console.log(data.transaksi);
       calculateTotalPaidAmount(data.transaksi); // Calculate total paid amount
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
if (error) {
    return <div>Error: {error}</div>; // Render error message
  }
  if (!user) {
    return <div>Loading...</div>; // or a proper loading indicator
  }
   const calculateTotalPaidAmount = (transactions) => {
    const currentYear = new Date().getFullYear();
    const filteredTransactions = transactions.filter(transaction =>
      new Date(transaction.transactionDate).getFullYear() === currentYear
    );
    const totalAmount = filteredTransactions.reduce((total, transaction) => total + transaction.totalPrice, 0);
    setTotalPaidAmount(totalAmount);
  };
return (
    <Layout>
      <div className='py-8'>
       <h1 className="pl-3 text-3xl font-bold text-rose-400">Beranda</h1>
       <p className="pl-3">Welcome, {user.username}!</p>
      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel with LineChart */}
        <div className="col-span-6">
            <LineChart transactions={transactions} />
        </div>

        {/* Right Panel with Vertical Cards */}
        <div className="col-span-6 my-2">
          <div className="grid grid-cols-1 gap-4">
            {/* Total Paid Amount in Current Year */}
            <div className="bg-white p-4 shadow rounded-md">
              <h2 className="text-lg font-semibold mb-2">Total Amount (Paid) This Year</h2>
              <p className="text-3xl text-gray-900">Rp {totalPaidAmount.toLocaleString()}</p>
            </div>

            {/* Unique Customers Count */}
            <div className="bg-white p-4 shadow rounded-md">
              <h2 className="text-lg font-semibold mb-2">Unique Customers (Paid)</h2>
              {/* Logic to count unique customer IDs */}
              <p className="text-3xl text-gray-900">{new Set(transactions.map(trans => trans.customerId)).size}</p>
            </div>

            {/* Total Products Sold */}
            <div className="bg-white p-4 shadow rounded-md">
              <h2 className="text-lg font-semibold mb-2">Total </h2>
              <p className="text-3xl text-gray-900">
                {transactions.reduce((total, trans) => total + trans.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );



}
