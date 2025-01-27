import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import plot from '../../Assets/Plot-view1.png'
import buying1 from '../../Assets/buying1.png'
import buying2 from '../../Assets/buying2.png'
import Buying3 from '../../Assets/Buying3.png'
import Buying4 from '../../Assets/Buying4.png'
import Buying5 from '../../Assets/Buying5.png'
import house from '../../Assets/house.png';
import eee22 from '../../Assets/eee22.png';
import eee33 from '../../Assets/eee33.png';
import eee99 from '../../Assets/eee99.png';
import eee55 from '../../Assets/eee55.png';
import eee77 from '../../Assets/eee77.png';
import eee111 from '../../Assets/eee111.png';
import rrrr11 from '../../Assets/rrrr11.png';
import rrrr22 from '../../Assets/rrrr22.png';
import rrrr33 from '../../Assets/rrrr33.png';
import rrrr44 from '../../Assets/rrrr44.png';
import rrrr55 from '../../Assets/rrrr55.png';

const AllProducts = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories array remains the same
  const categories = [
    { id: 'all', label: 'View All' },
    { id: 'apartments', label: 'Apartments' },
    { id: 'buying', label: 'Buying' },
    { id: 'renting', label: 'Renting' },
    { id: 'cars', label: 'Cars' },
    { id: 'land', label: 'Land' }
  ];

  // Using a placeholder image
  

  const listings = [
    {
      id: 1,
      title: 'Full furnished apartment',
      type: 'land',
      status: 'For Sale',
      location: 'Beverly Hills, Bangkok',
      price: '1,000,000',
      beds: 3,
      baths: 2,
      image: plot,
      category: 'land'
    },
    {
      id: 2,
      title: 'Un-furnished apartment',
      type: 'land',
      status: 'For Sale',
      location: 'Beverly Hills, Bangkok',
      price: '200,000',
      image: buying1,
      category: 'land'
    },
    {
      id: 3,
      title: 'Hybrid car',
      type: 'land',
      status: 'For Sale',
      location: 'Automatic',
      price: '12,000',
      specs: '2016 / Electric',
      image: buying2,
      category: 'land'
    },
    {
      id: 4,
      title: 'Full furnished apartment',
      type: 'land',
      status: 'For Sale',
      location: 'Beverly Hills, Bangkok',
      price: '200,000',
      image: Buying3,
      category: 'land'
    },
    {
      id: 5,
      title: 'Land property',
      type: 'land',
      status: 'For Sale',
      location: 'Beverly Hills Bangkok',
      price: '45,000,000',
      size: '8044 Sqm',
      image: Buying4,
      category: 'land'
    },
    {
      id: 6,
      title: 'Hybrid car',
      type: 'land',
      status: 'For Sale',
      location: 'Automatic',
      price: '12,000',
      specs: '2016 / Electric',
      image: Buying5,
      category: 'land'
    },
    {
            id: 1,
            type: 'Apartment',
            status: 'For Sale',
            title: 'Full furnished apartment',
            location: 'Karelia, Rajas Riverside',
            price: '1,000,000',
            beds: 3,
            baths: 2,
            image: house,
            category: 'apartments'
          },
          {
            id: 2,
            type: 'Apartment',
            status: 'For Sale',
            title: 'Un-furnished apartment',
            location: 'Rakyat, Kipas Riverside',
            price: '200,000',
            beds: 2,
            baths: 1,
            image: eee22,
            category: 'apartments'
          },
          {
            id: 2,
            type: 'Apartment',
            status: 'For Rent',
            title: 'Un-furnished apartment',
            location: 'Rakyat, Kipas Riverside',
            price: '200,000',
            beds: 2,
            baths: 1,
            image: eee111,
            category: 'apartments'
          },
          {
            id: 3,
            type: 'Car',
            status: 'For Rent',
            title: 'Hybrid car',
            location: 'Automatic',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: eee33,
            category: 'cars'
          },
          {
            id: 4,
            type: 'Car',
            status: 'For Rent',
            title: 'Hybrid car',
            location: 'Automatic',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: eee99,
            category: 'cars'
          },
          {
            id: 5,
            type: 'renting',
            status: 'For Rent',
            title: 'Un-furnished apartment',
            location: 'Kigali, Kicukiro',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: eee55,
            category: 'renting'
          },
          {
            id: 6,
            type: 'Car',
            status: 'For Rent',
            title: 'Hybrid car',
            location: 'Automatic',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: eee77,
            category: 'cars'
          },
          {
            id: 6,
            type: 'buying',
            status: 'For Sale',
            title: 'House for Sale',
            location: 'Kigaragara, Kicukiro',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: rrrr11,
            category: 'buying'
          },
          {
            id: 6,
            type: 'buying',
            status: 'For Sale',
            title: 'House for Sale',
            location: 'Kigaragara, Kicukiro',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: rrrr22,
            category: 'buying'
          },
            {
            id: 6,
            type: 'buying',
            status: 'For Sale',
            title: 'House for Sale',
            location: 'Kigaragara, Kicukiro',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: rrrr33,
            category: 'buying'
          },
          {
            id: 6,
            type: 'buying',
            status: 'For Sale',
            title: 'House for Sale',
            location: 'Kigaragara, Kicukiro',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: rrrr44,
            category: 'buying'
          },
          {
            id: 6,
            type: 'buying',
            status: 'For Sale',
            title: 'House for Sale',
            location: 'Kigaragara, Kicukiro',
            price: '12,000',
            year: '2019',
            isElectric: true,
            image: rrrr55,
            category: 'buying'
          }, 
  ];

  const filteredListings = activeCategory === 'all' 
    ? listings 
    : listings.filter(listing => listing.category === activeCategory.toLowerCase());

  return (
    <div className="container text-center mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Listings</h1>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image Container */}
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/300";
                }}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <Heart size={20} className="text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                  {listing.type}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 text-sm text-white bg-blue-600 rounded-full">
                  {listing.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
              
              {/* Specs (if available) */}
              {listing.beds && listing.baths && (
                <div className="flex gap-4 text-sm text-gray-500 mb-2 justify-center">
                  <span>{listing.beds} Beds</span>
                  <span>{listing.baths} Baths</span>
                </div>
              )}
              
              {listing.specs && (
                <div className="text-sm text-gray-500 mb-2">
                  {listing.specs}
                </div>
              )}
              
              {listing.size && (
                <div className="text-sm text-gray-500 mb-2">
                  {listing.size}
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">${listing.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;


