import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  FileText, 
  Tag, 
  Bookmark, 
  MapPin, 
  Bed, 
  Droplet, 
  X, 
  Upload, 
  Image as ImageIcon,
  Save
} from 'lucide-react';
import toast from "react-hot-toast"; // Import react-hot-toast

const CATEGORIES = ["Residential", "Commercial", "Land", "Industrial", "Luxury", "Vacation Rentals"];
const TYPES = ["House", "Office", "Apartment/Condo", "Land", "Commercial Space", "Industrial Property"];
const STATUSES = ["Available", "Pending", "Sold", "Rented", "Under Construction", "For Sale", "Rental"];


const UpdateProductForm = ({ id }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    category: "",
    status: "",
    location: "",
    beds: "",
    baths: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  const [displayImagePreview, setDisplayImagePreview] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API call
        const response = await fetch(`http://localhost:5000/api/product/single/${id}`);
        const data = await response.json();
        
        const product = data.product;
        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          type: product.type || "",
          category: Array.isArray(product.category) ? product.category[0] : product.category || "",
          status: product.status || "",
          location: product.location || "",
          beds: product.beds?.toString() || "",
          baths: product.baths?.toString() || "",
        });

        setDisplayImagePreview(product.displayImage ? 
          `http://localhost:5000${product.displayImage}` : "");
        
        const images = Array.isArray(product.image) ? product.image : [];
        setExistingImages(images);
        setImagesPreviews(images.map((img) => `http://localhost:5000${img}`));
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDisplayImage(file);
      setDisplayImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagesPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImagesChange({ target: { files: e.dataTransfer.files } });
  };

  const handleRemoveImage = (index) => {
    if (index < existingImages.length) {
      setRemovedImages(prev => [...prev, existingImages[index]]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - existingImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== adjustedIndex));
    }
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Create FormData object
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (displayImage) {
        formDataToSend.append("displayImage", displayImage);
      }

      newImages.forEach(image => {
        formDataToSend.append("images", image);
      });

      formDataToSend.append("removedImages", JSON.stringify(removedImages));

      // Replace with your actual API call
      const response = await fetch(`http://localhost:5000/api/product/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      toast.success("Product updated successfully!");
      navigate("/all-products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && Object.values(formData).every(value => !value)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Title field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Home size={16} />
              <span>Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
              placeholder="Enter property title"
            />
          </div>

          {/* Price field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign size={16} />
              <span>Price</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
              placeholder="Enter price"
            />
          </div>
        </div>

        {/* Description field */}
        <div className="space-y-2 mb-8">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText size={16} />
            <span>Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            rows={4}
            required
            placeholder="Enter property description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Category field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag size={16} />
              <span>Category</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Type field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Home size={16} />
              <span>Type</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select Type</option>
              {TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bookmark size={16} />
              <span>Status</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select Status</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Location field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={16} />
              <span>Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
              placeholder="Enter location"
            />
          </div>

          {/* Beds field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bed size={16} />
              <span>Beds</span>
            </label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Number of beds"
            />
          </div>

          {/* Baths field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Droplet size={16} />
              <span>Baths</span>
            </label>
            <input
              type="number"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Number of baths"
            />
          </div>
        </div>

        {/* Display Image section */}
        <div className="space-y-2 mb-8">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ImageIcon size={16} />
            <span>Display Image</span>
          </label>
          <div
            className={`mt-1 flex justify-center p-6 border-2 ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } border-dashed rounded-lg transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {displayImagePreview ? (
              <div className="relative group">
                <img
                  src={displayImagePreview}
                  alt="Display preview"
                  className="h-44 w-full max-w-xs object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setDisplayImage(null);
                      setDisplayImagePreview("");
                    }}
                    className="p-2 bg-red-500 text-white rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload size={24} className="text-gray-600" />
                </div>
                <div className="text-sm text-gray-600">
                  <label className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleDisplayImageChange}
                    />
                  </label>
                  <p className="">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images section */}
        <div className="space-y-2 mb-8">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ImageIcon size={16} />
            <span>Additional Images</span>
          </label>
          <div
            className={`mt-1 flex justify-center p-6 border-2 ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } border-dashed rounded-lg transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <Upload size={24} className="text-gray-600" />
              </div>
              <div className="text-sm text-gray-600">
                <label className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImagesChange({ target: { files: e.target.files } })}
                  />
                </label>
                <p className="">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          {/* Image previews */}
          {imagesPreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-4 mt-4">
              {imagesPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Update Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;