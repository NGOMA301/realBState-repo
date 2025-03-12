import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UpdateProductForm from '../components/UpdateProductForm';

const UpdateProduct = () => {
  const { id } = useParams();
  
  return (
    <div>
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Update Product</h1>
          
          {/* Pass id to the form */}
          <UpdateProductForm id={id || ''} />
        </div>
      </div>
  );
};

export default UpdateProduct;