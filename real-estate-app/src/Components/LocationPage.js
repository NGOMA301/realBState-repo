import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hhh11 from '../Assets/hhh11.png'
import hhh22 from '../Assets/hhh22.png'
import hhh33 from '../Assets/hhh33.png'

const LocationPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      id: 1,
      title: "Office Building 1",
      src: hhh11,
      alt: "Modern office building with glass facade"
    },
    {
      id: 2,
      title: "Office Building 2",
      src: hhh22,
      alt: "Corporate headquarters with unique architecture"
    },
    {
      id: 3,
      title: "Office Building 3",
      src: hhh33,
      alt: "Business center in urban setting"
    },
    {
      id: 4,
      title: "Office Building 4",
      src: hhh22,
      alt: "Contemporary office complex"
    },
    {
      id: 5,
      title: "Office Building 5",
      src: "/api/placeholder/800/600",
      alt: "Modern business park"
    },
    {
      id: 6,
      title: "Office Building 6",
      src: "/api/placeholder/800/600",
      alt: "Tech campus building"
    },
    {
      id: 7,
      title: "Office Building 7",
      src: "/api/placeholder/800/600",
      alt: "Innovation center"
    },
    {
      id: 8,
      title: "Office Building 8",
      src: "/api/placeholder/800/600",
      alt: "Research facility"
    }
  ];

  const totalSlides = Math.ceil(images.length / 4);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 4) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Locations for You</h2>
      
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images
            .slice(currentSlide * 4, (currentSlide + 1) * 4)
            .map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm font-medium">{image.title}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;