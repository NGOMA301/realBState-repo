"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

// Define option arrays
const CATEGORIES = ["Residential", "Commercial", "Land", "Industrial","Luxury","Vacation Rentals"]
const TYPES = ["House","Office", "Apartment/Condo", "Land","Commercial Space","Industrial Property "]
const STATUSES = ["Available","Pending", "Sold", "Rented", "Under Construction","For Sale", "Rental"]

const CreateProductForm = () => {
  const navigate = useNavigate()

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
  })

  // Image state
  const [displayImage, setDisplayImage] = useState(null)
  const [displayImagePreview, setDisplayImagePreview] = useState("")
  const [images, setImages] = useState([])
  const [imagesPreviews, setImagesPreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle display image upload
  const handleDisplayImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setDisplayImage(file)
      setDisplayImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle multiple image upload
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagesPreviews((prev) => [...prev, ...newPreviews])
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files])
      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagesPreviews((prev) => [...prev, ...newPreviews])
    }
  }, [])

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = new FormData()

    // Append form fields
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value)
    })

    // Append images
    if (displayImage) {
      submitData.append("displayImage", displayImage)
    }

    images.forEach((image) => {
      submitData.append("images", image)
    })

    try {
      const response = await fetch("http://localhost:5000/api/product/new", {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        navigate("/all-products")
      } else {
        throw new Error("Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-neutral-100 p-8 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            rows={4}
            required
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Select Type</option>
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Select Status</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location and Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Beds</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Baths</label>
            <input
              type="number"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Display Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Display Image</label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } border-dashed rounded-lg transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleDisplayImageChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {displayImagePreview && (
            <div className="mt-2">
              <img
                src={displayImagePreview || "/placeholder.svg"}
                alt="Display preview"
                className="h-40 w-40 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Additional Images Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Additional Images</label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } border-dashed rounded-lg transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload files</span>
                  <input type="file" className="sr-only" accept="image/*" multiple onChange={handleImagesChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imagesPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Create Product
        </button>
      </form>
    </div>
  )
}

export default CreateProductForm

