import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import PlusIcon from '@heroicons/react/solid/PlusIcon';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [alert, setAlert] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    // Check if in browser environment before fetching
    if (typeof window !== 'undefined') {
      fetchCustomers();
    }
     // Fetch immediately on client-side navigation
    if (!showAddModal && !showEditModal && !showDeleteModal) {
      fetchCustomers();
    }
  }, [page, searchTerm]);;

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/customer?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
            console.log(data, response)
      setCustomers(data.customers || []); // Ensure data.customers is defined
      setTotalCount(data.totalCount || 0);

    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Set customers to empty array on error
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeAddModal();
        fetchCustomers();
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update customer:', errorData);
        setAlert({ type: 'error', message: errorData.error || 'Failed to create/update customer' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.message || 'An unexpected error occurred' });
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/customer?id=${currentCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeEditModal();
        fetchCustomers();
      } else {
        const errorData = await response.json();
        console.error('Failed to update customer:', errorData);
        setAlert({ type: 'error', message: errorData.error || 'Failed to update customer' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.message || 'An unexpected error occurred' });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customer?id=${currentCustomer.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        closeDeleteModal();
        fetchCustomers();
      } else {
        const errorData = await response.json();
        console.error('Failed to delete customer:', errorData);
        setAlert({ type: 'error', message: errorData.error || 'Failed to delete customer' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.message || 'An unexpected error occurred' });
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
    });
  };

  const openEditModal = (customer) => {
    setCurrentCustomer(customer);
    setFormData({
      username: customer.username,
      password: '', // Password should be empty or handled differently
      name: customer.name,
      email: customer.email,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentCustomer(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
    });
  };

  const openDeleteModal = (customer) => {
    setCurrentCustomer(customer);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentCustomer(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-left pb-4 text-2xl font-bold text-rose-400 sm:text-3xl">Pelanggan</h1>
        {alert && (
          <div className={`alert ${alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md mb-4`}>
            {alert.message}
          </div>
        )}

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Cari Pelanggan"
            className="shadow appearance-none w-64 rounded-lg p-3 text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="ml-auto group relative inline-flex items-center overflow-hidden rounded bg-rose-400 px-8 py-2 text-white focus:outline-none focus:ring active:bg-rose-300"
            onClick={openAddModal}
          >
            <span className="absolute -right-full transition-all group-hover:right-4">
              <PlusIcon className="w-5 h-5" />
            </span>
            <span className="text-sm rounded-sm font-medium transition-all group-hover:mr-4">Tambah</span>
          </button>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="py-2 px-4">{customer.id}</td>
                  <td className="py-2 px-4">{customer.username}</td>
                  <td className="py-2 px-4">{customer.name}</td>
                  <td className="py-2 px-4">{customer.email}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => openEditModal(customer)} className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2">Edit</button>
                    <button onClick={() => openDeleteModal(customer)} className="bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex text-sm justify-between items-center mt-4">
          <button
            className={`px-4 py-2 rounded ${page <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-400 text-white'}`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Sebelumnya
          </button>
          <span className="text-sm">
            Halaman {page} dari {Math.ceil(totalCount / pageSize)}
          </span>
          <button
            className={`px-4 py-2 rounded ${page >= Math.ceil(totalCount / pageSize) ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-400 text-white'}`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= Math.ceil(totalCount / pageSize)}
          >
            Selanjutnya
          </button>
        </div>

        {/* Add Modal */}
        {showAddModal && (
        <div className="fixed text-sm inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[calc(20%+10px)]">
            <h2 className="text-xl font-bold mb-4">Tambah Pelanggan</h2>
            <label className="block mb-2">
                <span className="text-gray-700">Username</span>
                <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Password</span>
                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Nama</span>
                <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Email</span>
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            
            <button onClick={closeAddModal} className="bg-gray-500 text-white px-4 my-5 py-2 rounded">Batal</button>
            <button onClick={handleSubmit} className="bg-rose-500 text-white mx-3 px-4 py-2 rounded mr-2">Simpan</button>
            </div>
        </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
        <div className="fixed text-sm inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[calc(20%+10px)]">
            <h2 className="text-xl font-bold mb-4">Edit Pelanggan</h2>
            <label className="block mb-2">
                <span className="text-gray-700">Username</span>
                <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Password</span>
                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Nama</span>
                <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Email</span>
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border rounded"
                />
            </label>
            
            <button onClick={closeEditModal} className="bg-gray-500 text-white px-4 my-5 py-2 rounded">Batal</button>
            <button onClick={handleEditSubmit} className="bg-rose-500 text-white mx-3 px-4 py-2 rounded mr-2">Update</button>
            </div>
        </div>
        )}



        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed text-sm inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Hapus Pelanggan</h2>
              <p>Apakah kamu ingin menghapus pelanggan {currentCustomer?.name}?</p>
              
              <button onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 my-5 py-2 rounded">Batal</button>
              <button onClick={handleDelete} className="bg-rose-500 text-white mx-3 px-4 py-2 rounded mr-2">Hapus</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
// Export the component using dynamic import with no SSR
export default dynamic(() => Promise.resolve(Customer), { ssr: false });
