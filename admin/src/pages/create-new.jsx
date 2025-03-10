import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Upload,
  X,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bed,
  Bath,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/api";

// Define option arrays
const CATEGORIES = [
  "Residential",
  "Commercial",
  "Land",
  "Industrial",
  "Luxury",
  "Vacation Rentals",
];

const TYPES = [
  "House",
  "Office",
  "Apartment/Condo",
  "Land",
  "Commercial Space",
  "Industrial Property",
];

const STATUSES = [
  "Available",
  "Pending",
  "Sold",
  "Rented",
  "Under Construction",
  "For Sale",
  "Rental",
];

const CreateProductForm = () => {
  const navigate = useNavigate();

  // Form state
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

  // Image state
  const [displayImage, setDisplayImage] = useState(null);
  const [displayImagePreview, setDisplayImagePreview] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle display image upload
  const handleDisplayImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDisplayImage(file);
      setDisplayImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle multiple image upload
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagesPreviews((prev) => [...prev, ...newPreviews]);
    }
  }, []);

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      toast.error("Please login to create a property listing");
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();

    // Append form fields
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    // Append images
    if (displayImage) {
      submitData.append("displayImage", displayImage);
    }

    images.forEach((image) => {
      submitData.append("images", image);
    });

    try {
      const response = await api.post("http://localhost:5000/api/product/new", submitData, {
        withCredentials: true,
      });
  

      if (response.data.message === 'Product created successfully') {
        toast.success("Product created successfully!");
        navigate("/all-products");
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <div className="container px-6 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Property
        </h1>
        <p className="text-gray-600">
          Fill in the details to create a new property listing
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter property title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows={4}
                placeholder="Provide a detailed description of the property"
                required
              />
            </div>
          </div>

          {/* Property Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Select Type</option>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Select Status</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Location</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Address or location"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Bed size={16} />
                    <span>Bedrooms</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Number of bedrooms"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Bath size={16} />
                    <span>Bathrooms</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="baths"
                  value={formData.baths}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Number of bathrooms"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Property Images
            </h2>

            {/* Display Image Upload */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Featured Image (Main Display)
              </label>
              <div
                className={`relative border-2 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                } border-dashed rounded-lg p-6 transition-colors duration-200 flex flex-col items-center justify-center`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {displayImagePreview ? (
                  <div className="relative w-full h-64">
                    <img
                      src={displayImagePreview}
                      alt="Display preview"
                      className="w-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDisplayImage(null);
                        setDisplayImagePreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImagePlus size={40} className="text-gray-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleDisplayImageChange}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Additional Images Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Additional Images (Gallery)
              </label>
              <div
                className={`border-2 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                } border-dashed rounded-lg p-6 transition-colors duration-200 flex flex-col items-center justify-center relative`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload size={40} className="text-gray-400 mb-4" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
              </div>

              {/* Image Previews */}
              {imagesPreviews.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-32 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/all-products")}
              className="mr-4 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !user} // Disable if not logged in
              className={`px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium flex items-center ${
                isSubmitting || !user ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  {user ? "Create Property" : "Login to Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default CreateProductForm;
