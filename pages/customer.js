import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'; // Import the Layout component
import { useRouter } from 'next/router';

const Customer = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
const BASE_URL = "http://localhost:3000";
  const [storedId, setStoredId] = useState(null);
  const [page, setPage] = useState(1); // Current page of products
  const [pageSize, setPageSize] = useState(10); // Number of products per page
  const [totalCount, setTotalCount] = useState(0); // Total number of products
 const [isSuccessVisible, setIsSuccessVisible] = useState(false);
 const [isLoading, setIsLoading] = useState(true); // Add this line

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const id = localStorage.getItem('id');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login'); // Redirect to login if user is not authenticated
    }
    if (storedId) {
      setStoredId(storedId); // Set the storedId state with the value from localStorage
    }

      const fetchProducts = async () => {
      try {
         setIsLoading(true); // Add this line
        const response = await fetch(`/api/product?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        setProducts(data.products);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false); // Add this line
      }
    };

    fetchProducts();
  }, [page, pageSize, router]);

  const handleTambahClick = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };
  const handleKeranjangClick = () => {
    router.push('/checkout'); // Navigate to the cart or checkout page
  };
  const handleConfirm = async () => {
    if (quantity <= selectedProduct.stock) {
      try {
        console.log(user.id);
        const response = await fetch('/api/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idCustomer: user.id, // Assuming user has an id property
            idProduct: selectedProduct.id,
            quantity: quantity,
            price: selectedProduct.price,
          }),
        });

        if (response.ok) {
          setIsSuccessVisible(true); // Show success message

          // Close success message after 2 seconds
          setTimeout(() => {
            setIsSuccessVisible(false);
          }, 2000);

          handlePopupClose();
        } else {
          console.error('Failed to create transaction');
        }
      } catch (error) {
        console.error('Error creating transaction:', error);
      }
    } else {
      alert('Quantity exceeds stock');
    }
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    // Redirect to login page
    router.push('/');
  };
  const handlePrevPage = () => {
    setPage(page - 1);
  };

  if (!user) {
    return <div>Loading...</div>; // or a proper loading indicator
  }

  return (
    <div>
      <header className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Selamat Datang, {user.username}!</h1>
            <p className="mt-1.5 text-sm text-gray-500">Temukan kosmetik favoritmu! 🎉</p>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring"
              type="button"
              onClick={handleKeranjangClick}
            >
              <span className="text-sm font-medium"> Keranjang </span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </button>
            <button
              className="block rounded-lg bg-rose-400 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2">
          <div className="lg:max-w-lg">
            <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
              Serenity Skin
            </h1>
            <div className="mt-8 space-y-5">
              <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mx-2">Pusat Kecantikan</span>
              </p>
              <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mx-2">Indah</span>
              </p>
              <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mx-2">Elegan</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-50 lg:w-1/2">
          <img className="object-cover w-full h-full mx-auto rounded-md lg:max-w-2xl" src="https://i.postimg.cc/Y0G2jfYx/Untitled.png" alt="Serenity Skin" />
        </div>
      </div>

       <section className="bg-white py-16">
      <div className="max-w-7xl container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {isLoading ? (
            // Render skeleton loaders when loading
            Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 mb-2"></div>
                  <div className="h-4 bg-gray-200"></div>
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} onTambahClick={handleTambahClick} />
            ))
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="mr-4 px-4 py-2 bg-rose-500 text-white rounded-md"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page * pageSize >= totalCount}
            className="px-4 py-2 bg-rose-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </section>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Tambah ke Keranjang</h2>
            <p className="mb-4">Masukkan jumlah untuk produk {selectedProduct.name}:</p>
            <input type='hidden' name='id_user' value={storedId}/>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full px-4 py-2 border rounded-md"
              min="1"
              max={selectedProduct.stock}
            />
            <div className="mt-4 flex justify-end">
              <button onClick={handlePopupClose} className="mr-4 px-4 py-2 bg-gray-300 rounded-md">Batal</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-rose-400 text-white rounded-md">OK</button>
            </div>
          </div>
        </div>
      )}
      {/* Success message popup */}
      {isSuccessVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-rose-500 p-8 rounded-md shadow-lg">
            <h2 className="text-lg text-bold mb-4 text-white">Berhasil Tambah!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, onTambahClick }) => (

  <a href="#" className="group relative block overflow-hidden">
    <button
      className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75"
    >
      <span className="sr-only">Wishlist</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
    <img
      src={product.imageUrl ? `/public/upload/${product.imageUrl}` : "https://atlas-content-cdn.pixelsquid.com/stock-images/lipstick-n1QlzDF-600.jpg"}
      alt=""
      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
    />
    <div className="relative border border-gray-100 bg-white p-6">
      <span className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium ${product.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`}>
        {product.stock > 0 ? 'Tersedia' : 'Habis'}
      </span>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{product.name}</h3>
      <p className="mt-1.5 text-sm text-gray-700">Rp {product.price.toFixed(2)}</p>

      <button
        className="mt-4 flex items-center justify-center rounded-md bg-rose-500 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600"
        onClick={() => onTambahClick(product)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 px-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Tambah
      </button>
    </div>
  </a>
);

export default Customer;
