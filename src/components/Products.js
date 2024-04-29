import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

export default function Products() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // Store image file
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error occurred while fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('image', image); // Append image file to form data

      const response = await axios.post('http://127.0.0.1:8000/api/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      });
      console.log('Product added successfully:', response.data);
      // Show toast message
      toast.success('Product added successfully');
      // Refresh the product list after adding a new product
      fetchProducts();
      // Clear input fields and image state
      setName('');
      setPrice('');
      setImage(null);
    } catch (error) {
      console.error('Error occurred while adding product:', error);
    }
  };

  const handleImageChange = (e) => {
    // Get the selected image file from the input
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
      // Show toast message
      toast.success('Product deleted successfully');
      // Refresh the product list after deletion
      fetchProducts();
    } catch (error) {
      console.error('Error occurred while deleting product:', error);
    }
  };

  return (
    <>
    <ToastContainer />
    <Navbar />
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="form-control"
            accept="image/*"
            required
          />
        </div>
        <div className='Addproduct'><button type="submit" className="btn btn-primary">Add Product</button></div>
        
      </form>
      <div className="products-container">
        <h2>Products</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} className="product-image" />
                </td>
                <td>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          {/* Pagination controls */}
        </div>
      )}
    </div>
    </>
  );
}
