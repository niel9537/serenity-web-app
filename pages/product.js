import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import PlusIcon from '@heroicons/react/solid/PlusIcon';
import mime from "mime";
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    brand: '',
    stock: '',
    expiredDate: '',
    imageUrl: '', // Add imageUrl state to store uploaded image URL
  });
  const [imageFile, setImageFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    type: '',
    price: '',
    brand: '',
    stock: '',
    expiredDate: '',
    imageUrl: '',
  });
  const [editImageFile, setEditImageFile] = useState(null);
  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/product?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      setProducts(data.products);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSubmit = async () => {
    try {
      // Validate form data before proceeding
      if (!formData.name || !formData.type || !formData.price || !formData.brand || !formData.stock || !formData.expiredDate) {
        closeModal();
        setAlert({ type: 'error', message: 'Semua data harus diisi' });

        // Clear alert after 2 seconds
        setTimeout(() => {
          setAlert(null);
        }, 2000);

        return; // Exit function if validation fails
      }
    setFormData({ ...formData, imageUrl: 'examplePath.jpg' });
    console.log('Manually set formData:', { ...formData, imageUrl: 'examplePath.jpg' });
      // Upload image first if there is an imageFile
      if (imageFile) {
        const formDataWithImage = new FormData();
        formDataWithImage.append('imageFile', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataWithImage,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Gagal upload image');
        }

        const uploadData = await uploadResponse.json();
        const imagePath = uploadData.imageUrl;
                 console.log(JSON.stringify(imagePath));
        setFormData({ ...formData, imageUrl: 'imagePath' }); // Update formData with imageUrl
        console.log('Manually set formData:', { ...formData, imageUrl: imagePath });
      }
        console.log('image'+formData.imageUrl);
      // Create product with the updated formData (including imageUrl)
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData);
        setAlert({ type: 'error', message: errorData.error || 'Gagal menambahkan produk' });
          setTimeout(() => {
            setAlert(null);
          }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.message || 'Error' });
        setTimeout(() => {
            setAlert(null);
          }, 2000);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const openModal = () => {
    setShowModal(true);
  };
  const openEditModal = (product) => {
    console.log(product, product.id);
    setEditFormData({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      brand: product.brand,
      stock: product.stock,
      expiredDate: product.expiredDate,
      imageUrl: product.imageUrl,
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({
      id: '',
      name: '',
      type: '',
      price: '',
      brand: '',
      stock: '',
      expiredDate: '',
      imageUrl: '',
    });
    setEditImageFile(null);
  };
  const handleEditSubmit = async () => {
    try {
  
      if (!editFormData.name || !editFormData.type || !editFormData.price || !editFormData.brand || !editFormData.stock || !editFormData.expiredDate) {
        closeEditModal();
        setAlert({ type: 'error', message: 'Semua data harus diisi' });
        // Clear alert after 2 seconds
          setTimeout(() => {
            setAlert(null);
          }, 2000);

          return; // Exit function if validation fails
      }
      // Upload image first if there is an editImageFile
      if (editImageFile) {
        const formData = new FormData();
        formData.append('imageFile', editImageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Gagal upload image');
        }

        const uploadData = await uploadResponse.json();
        setEditFormData({ ...editFormData, imageUrl: uploadData.imageUrl }); // Update editFormData with imageUrl
      }

      // Update product with the edited editFormData (including imageUrl)
      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        closeEditModal();
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error('Failed to update product:', errorData);
        setAlert({ type: 'error', message: errorData.error || 'Gagal memperbarui produk' });
          setTimeout(() => {
            setAlert(null);
          }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.message || 'Error' });
        setTimeout(() => {
            setAlert(null);
          }, 2000);
    }
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditFileChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      type: '',
      price: '',
      brand: '',
      stock: '',
      expiredDate: '',
      imageUrl: '', // Clear imageUrl state on modal close
    });
    setImageFile(null);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
  };
  const handleDeleteConfirm = async () => {
    console.log(productToDelete.id)
      try {
        const response = await fetch(`/api/product?id=${productToDelete.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setAlert({ type: 'success', message: `Produk ${productToDelete.name} berhasil dihapus.` });
          setTimeout(() => {
            setAlert(null);
          }, 2000);
          fetchProducts(); // Refresh product list
        } else {
          const errorData = await response.json();
          console.error('Failed to delete product:', errorData);
          setAlert({ type: 'error', message: errorData.error || 'Gagal menghapus produk.' });
        }

        setProductToDelete(null); // Clear productToDelete state
      } catch (error) {
        console.error('Error:', error);
        setAlert({ type: 'error', message: 'Terjadi kesalahan saat menghapus produk.' });
      }
    };
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-left pb-4 text-2xl font-bold text-rose-400 sm:text-3xl">Produk</h1>
        {alert && (
          <div className={`alert ${alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md mb-4`}>
            {alert.message}
          </div>
        )}

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Cari product"
            className="shadow appearance-none w-64 rounded-lg p-3 text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="ml-auto group relative inline-flex items-center overflow-hidden rounded bg-rose-400 px-8 py-2 text-white focus:outline-none focus:ring active:bg-rose-300"
            onClick={openModal}
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
              <th className="py-2 px-4">Nama Produk</th>
              <th className="py-2 px-4">Tipe</th>
              <th className="py-2 px-4">Harga</th>
              <th className="py-2 px-4">Brand</th>
              <th className="py-2 px-4">Stok</th>
              <th className="py-2 px-4">Tanggal Kedaluwarsa</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4">{product.id}</td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.type}</td>
                  <td className="py-2 px-4">{product.price}</td>
                  <td className="py-2 px-4">{product.brand}</td>
                  <td className="py-2 px-4">{product.stock}</td>
                  <td className="py-2 px-4">{new Date(product.expiredDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <Link to={`/product/${product.id}`} onClick={() => openEditModal(product)} className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2">Edit</Link>

                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={() => openDeleteModal(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4">No products found</td>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4">
            {/* Lebar modal disesuaikan dengan berbagai ukuran layar */}
            <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nama Produk</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-sm w-full p-2 border rounded"
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium mb-1">Tipe</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="text-sm w-full p-2 border rounded"
              >
                <option value="">Pilih Tipe</option>
                <option value="Foundation">Foundation</option>
                <option value="Lipstick">Lipstick</option>
                <option value="Eyeliner">Eyeliner</option>
                <option value="Blush On">Blush On</option>
                <option value="Mascara">Mascara</option>
                <option value="Eye Shadow">Eye Shadow</option>
                <option value="Moisturizer">Moisturizer</option>
                <option value="Serum">Serum</option>
                <option value="Sunscreen">Sunscreen</option>
                <option value="Toner">Toner</option>
                <option value="Cleanser">Cleanser</option>
                <option value="Face Mask">Face Mask</option>
                <option value="Exfoliator">Exfoliator</option>
                <option value="Lip Balm">Lip Balm</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Harga</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="text-sm w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="text-sm w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Stok</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="text-sm w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tanggal Kedaluwarsa</label>
              <input
                type="date"
                name="expiredDate"
                value={formData.expiredDate}
                onChange={handleInputChange}
                className="text-sm w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Gambar</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="text-sm w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="bg-rose-400 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


     {showEditModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <input type="hidden" name='id' value={editFormData.id}/>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditInputChange}
              className="text-sm w-full p-2 border rounded"
            />
          </div>
          <div className="text-sm mb-4">
            <label className="block text-sm font-medium mb-1">Tipe</label>
            <select
              name="type"
              value={editFormData.type}
              onChange={handleEditInputChange}
              className="text-sm w-full p-2 border rounded"
            >
              <option value="">Pilih Tipe</option>
              <option value="Foundation">Foundation</option>
              <option value="Lipstick">Lipstick</option>
              <option value="Eyeliner">Eyeliner</option>
              <option value="Blush On">Blush On</option>
              <option value="Mascara">Mascara</option>
              <option value="Eye Shadow">Eye Shadow</option>
              <option value="Moisturizer">Moisturizer</option>
              <option value="Serum">Serum</option>
              <option value="Sunscreen">Sunscreen</option>
              <option value="Toner">Toner</option>
              <option value="Cleanser">Cleanser</option>
              <option value="Face Mask">Face Mask</option>
              <option value="Exfoliator">Exfoliator</option>
              <option value="Lip Balm">Lip Balm</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Harga</label>
            <input
              type="number"
              name="price"
              value={editFormData.price}
              onChange={handleEditInputChange}
              className="text-sm w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={editFormData.brand}
              onChange={handleEditInputChange}
              className="text-sm w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Stok</label>
            <input
              type="number"
              name="stock"
              value={editFormData.stock}
              onChange={handleEditInputChange}
              className="text-sm w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tanggal Kedaluwarsa</label>
            <input
              type="date"
              name="expiredDate"
              value={editFormData.expiredDate}
              onChange={handleEditInputChange}
              className="text-sm w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Gambar</label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="text-sm w-full p-2 border rounded"
                      />
        </div>
          <div className="flex justify-end">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              onClick={closeEditModal}
            >
              Batal
            </button>
            <button
              className="bg-rose-400 text-white px-4 py-2 rounded"
              onClick={handleEditSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}


        {/* Delete Confirmation Modal */}
        {productToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Apakah kamu ingin menghapus produk {productToDelete?.name}?</p>
              <div className="flex justify-end mt-4">
                 <button onClick={() => setProductToDelete(null)} className="bg-gray-500 text-white px-4 mx-3 my-5 py-2 rounded ">Batal</button>
                 <button onClick={handleDeleteConfirm} className="bg-rose-500 text-white mx-3 px-4 my-5 py-2 rounded mr-2">Hapus</button>

              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Export the component using dynamic import with no SSR
export default dynamic(() => Promise.resolve(Product), { ssr: false });