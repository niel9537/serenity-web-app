import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false); // State for pop-up visibility
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCartItems(JSON.parse(storedUser).id); // Call fetchCartItems with user id
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`/api/transaction?idCustomer=${userId}&status=pending`);
      const data = await response.json();
      setCartItems(data.transaksi); // Ensure correct property name 'transaksi' from API response
      setIsLoading(false);
      console.log(data)
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil item keranjang:', error);
      setIsLoading(false);
    }
  };

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
    switch (e.target.value) {
      case 'NoBank':
        setBankAccountNumber('');
        break;
      case 'BCA':
        setBankAccountNumber('1234567890');
        break;
      case 'Mandiri':
        setBankAccountNumber('0987654321');
        break;
      case 'BNI':
        setBankAccountNumber('1122334455');
        break;
      default:
        setBankAccountNumber('');
        break;
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(`/api/transaction`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCustomer: user.id, // Assuming user.id is available
          newStatus: 'paid',
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengonfirmasi pembayaran');
      }

      setIsSuccessVisible(true);

      setTimeout(() => {
        setIsSuccessVisible(false);
        router.push('/customer');
      }, 3000);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengonfirmasi pembayaran:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/transaction?id=${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Item deleted successfully, fetch updated cart items
        fetchCartItems(user.id); // Assuming user.id is available in state
      } else {
        console.error('Gagal menghapus item dari keranjang.', response);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus item:', error);
    }
  };

  const handleBackToCustomerPage = () => {
    router.push('/customer');
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-2/3 px-4 mb-4 md:mb-0">
          <h2 className="text-xs font-semibold text-gray-500 mb-4">Keranjang Anda</h2>
          {isLoading ? (
            <Skeleton count={5} />
          ) : (
            <ul className="space-y-4 text-xs">
              {cartItems.length === 0 ? (
                <p>Tidak ada item di keranjang.</p>
              ) : (
                cartItems.map((item) => (
                  <li key={item.id} className="text-xs flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h3 className="text-xs">{item.product.name}</h3>
                      <p>Kuantitas: {item.quantity}</p>
                      <p>Harga: Rp {item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p>Total: Rp {item.totalPrice.toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline-block align-text-top"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 5.5a.5.5 0 011 0v9a.5.5 0 01-1 0v-9zm4-1a1.5 1.5 0 011.5 1.5V7h-3V5a1.5 1.5 0 011.5-1.5zm-8 0A1.5 1.5 0 015 5v2H2.5A1.5 1.5 0 011 5.5zM4 18a1 1 0 01-1-1v-10a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1H4zm5-9a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="w-full md:w-1/3 px-4">
          <h2 className="text-xl font-semibold mb-4">Konfirmasi Pembayaran</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pilih Bank</label>
            <select value={selectedBank} onChange={handleBankChange} className="w-full p-2 border rounded-md">
              <option value="NoBank">Pilih Bank</option>
              <option value="BCA">BCA</option>
              <option value="Mandiri">Mandiri</option>
              <option value="BNI">BNI</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nomor Rekening Bank</label>
            <input
              type="text"
              value={bankAccountNumber}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100"
            />
          </div>
          <button
            onClick={handlePayment}
            className="w-full py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
          >
            Bayar Sekarang
          </button>
          <button
            onClick={handleBackToCustomerPage}
            className="w-full my-2 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Pop-up for success message */}
      {isSuccessVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-rose-500 p-8 rounded-md shadow-lg">
            <h2 className="text-lg text-bold mb-4 text-white">Konfirmasi Pembayaran Berhasil!</h2>
            {/* Additional content or actions in the pop-up */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
