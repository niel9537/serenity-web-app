import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

// Conditionally disable SSR for this component
const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const fetchTransactions = async () => {
        try {
          const response = await fetch(`/api/income?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`);
          const data = await response.json();
          setTransactions(data.transactions);
          setTotalCount(data.totalCount);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };

      fetchTransactions();
    }
  }, [page, pageSize, searchTerm, isClient]);

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to calculate total quantity and total purchase
  const calculateTotals = () => {
    const totalQuantity = transactions.reduce((total, transaction) => total + transaction.quantity, 0);
    const totalPurchase = transactions.reduce((total, transaction) => total + transaction.totalPrice, 0);
    return { totalQuantity, totalPurchase };
  };

  // Render subtotal row
  const renderSubtotalRow = () => {
    const { totalQuantity, totalPurchase } = calculateTotals();
    return (
      <tr className="font-semibold">
        <td colSpan="3" className="py-2 px-4 text-right">Total</td>
        <td className="py-2 px-4">{totalQuantity}</td>
        <td className="py-2 px-4"></td>
        <td className="py-2 px-4">Rp. {totalPurchase.toFixed(2)}</td>
        <td colSpan="2" className="py-2 px-4"></td>
      </tr>
    );
  };

  // Function to render transactions
  const renderTransactions = () => {
    return transactions.map((transaction) => (
      <tr key={transaction.id}>
        <td className="py-2 px-4">{transaction.id}</td>
        <td className="py-2 px-4">{transaction.customerName}</td>
        <td className="py-2 px-4">{transaction.productName}</td>
        <td className="py-2 px-4">{transaction.quantity}</td>
        <td className="py-2 px-4">Rp. {transaction.price.toFixed(2)}</td>
        <td className="py-2 px-4">Rp. {transaction.totalPrice.toFixed(2)}</td>
        <td className="py-2 px-4">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
        <td className={`py-2 px-4 ${transaction.status === 'paid' ? 'bg-green-200' : 'bg-yellow-200'}`}>
          {transaction.status === 'paid' ? 'Telah Bayar' : 'Menunggu Pembayaran'}
        </td>
      </tr>
    ));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-rose-400 mb-4">Transaksi</h1>

        {/* Total transaksi dan total pembelian di atas search */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-semibold">Total Transaksi:</p>
            <p>{calculateTotals().totalQuantity}</p>
          </div>
          <div>
            <p className="font-semibold">Total Pembelian:</p>
            <p>Rp. {calculateTotals().totalPurchase.toFixed(2)}</p>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari Transaksi"
            className="shadow appearance-none w-64 rounded-lg p-3 text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Transaction list */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Pelanggan</th>
                <th className="py-2 px-4">Produk</th>
                <th className="py-2 px-4">Qty</th>
                <th className="py-2 px-4">Harga</th>
                <th className="py-2 px-4">Total Pembelian</th>
                <th className="py-2 px-4">Tanggal</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {transactions.length > 0 ? (
                <>
                  {renderTransactions()}
                  {renderSubtotalRow()}
                </>
              ) : (
                <tr>
                  <td colSpan="8" className="py-2 px-4">Tidak ada transaksi ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between text-sm items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-500 text-white'}`}
          >
            Sebelumnya
          </button>
          <span className="text-sm">
            Halaman {page} dari {Math.ceil(totalCount / pageSize)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page * pageSize >= totalCount}
            className={`px-4 py-2 rounded ${page * pageSize >= totalCount ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-500 text-white'}`}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </Layout>
  );
};

// Export the component using dynamic import with no SSR
export default dynamic(() => Promise.resolve(Transaksi), { ssr: false });
