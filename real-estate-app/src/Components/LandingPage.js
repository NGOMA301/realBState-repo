import React, { useState } from 'react';
import Kigali from '../Assets/Kigali.png'

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${Kigali})`,
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        
        {/* Left Side - Text Content */}
        <div className="text-white mb-8 lg:mb-0 lg:w-1/2">
          <h1 className="text-5xl sm:text-5xl font-bold mb-4">
            Discover a new way of living
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-xl">
            Embrace a living experience where every detail is designed to elevate your everyday life, merging luxury, functionality, and sustainability.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md lg:w-5/12">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Make an enquiry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
              >
                Get in touch
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;