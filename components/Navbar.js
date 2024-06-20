import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Product'); // Default selected tab

  // Update selectedTab based on current URL path
  useEffect(() => {
    const path = router.pathname;
    if (path === '/admin') setSelectedTab('Home');
    else if (path === '/product') setSelectedTab('Product');
    else if (path === '/customeradmin') setSelectedTab('Customer');
    else if (path === '/transaksi') setSelectedTab('Transaction');
  }, [router.pathname]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTab(selectedValue);
    router.push(
      selectedValue === 'Home' ? '/admin' : `/${selectedValue.toLowerCase().replace(' ', '')}`
    );
  };

  const handleLogout = () => {
    // Perform logout action (e.g., clear localStorage, redirect to login page)
    localStorage.removeItem('user'); // Example: Clear user data from localStorage
    router.push('/'); // Redirect to login page after logout
  };

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-5">
        <div className="flex justify-between items-center">
          {/* Left side navigation */}
          <div>
            <div className="sm:hidden">
              <label htmlFor="Tab" className="sr-only">Tab</label>
              <select
                id="Tab"
                className="w-full rounded-md border-gray-200"
                value={selectedTab}
                onChange={handleSelectChange}
              >
                <option value="Home">Home</option>
                <option value="Product">Produk</option>
                <option value="Customer">Pelanggan</option>
                <option value="Transaction">Transaksi</option>
              </select>
            </div>

            <div className="hidden sm:block">
              <nav className="mt-4 flex space-x-4">
                <Link href="/admin">
                  <span className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'Home' ? 'text-rose-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    Home
                  </span>
                </Link>
                <Link href="/product">
                  <span className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'Product' ? 'text-rose-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    Produk
                  </span>
                </Link>
                <Link href="/customeradmin">
                  <span className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'Customer' ? 'text-rose-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    Pelanggan
                  </span>
                </Link>
                <Link href="/transaksi">
                  <span className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'Transaction' ? 'text-rose-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    Transaksi
                  </span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Right side logout button */}
          <button
            className="block rounded-sm bg-rose-400 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
