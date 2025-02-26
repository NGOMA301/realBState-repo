"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const ImageGallery = ({ images = [], title }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!isZoomed) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
      {/* Thumbnail Column */}
      <div className="order-2 md:order-1">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:h-[400px] md:overflow-y-auto thumbnails-scroll">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 border-2 rounded-lg overflow-hidden ${
                selectedImage === index ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src={`http://localhost:5000${image}`}
                alt={`${title} - View ${index + 1}`}
                className="w-full h-20 object-cover aspect-auto"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <div className="relative order-1 md:order-2">
        <div
          className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={`http://localhost:5000${images[selectedImage]}`}
            alt={`${title} - Main View`}
            className={`w-full h-full object-cover transition-transform duration-200 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
          />

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={previousImage}
              className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

