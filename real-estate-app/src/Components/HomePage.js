/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Search, Heart, MapPin, Home, DollarSign, ChevronDown, Globe, Menu  } from 'lucide-react';
import housevia from '../Assets/housevia.png'

const NavLink = ({ href, children, isActive }) => (
    <a
      href={href}
      className={`text-sm font-medium transition-colors hover:text-blue-600 ${
        isActive ? 'text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </a>
  );

  const DropdownMenu = ({ items, isOpen }) => (
    <div 
      className={`absolute top-full left-0 mt-1 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div className="py-1">
        {items.map((item, index) => (
          <a
            key={index}
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );

  const LanguageSelector = ({ isOpen, onToggle }) => {
    const languages = ['English', 'Français', 'Ikinyarwanda'
    ];
    
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <Globe className="h-4 w-4" />
          <ChevronDown className="h-4 w-4" />
        </button>
        
        <div className={`absolute right-0 top-full mt-1 w-40 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
          isOpen ? 'block' : 'hidden'
        }`}>
          {languages.map((lang) => (
            <button
              key={lang}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    );
  };


  
  
  const HomePage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const buyOptions = ['Houses', 'Apartments', 'Plots', 'Commercial'];
  const rentOptions = ['Residential', 'Commercial', 'Vacation', 'Short-term'];

  const [filters, setFilters] = useState({
    lookingFor: '',
    location: '',
    propertyType: '',
    propertySize: '',
    budget: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search filters:', filters);
    // Here you would typically make an API call with the filters
  };
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl  justify-between px-4 py-4">
          <div className="flex items-center gap-12">
            <a href="#" className="text-xl font-bold">
              Real Estate
            </a>
            <div className="hidden lg:flex text-center gap-8">
              <NavLink href="#" isActive>Home</NavLink>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown (openDropdown === 'buy' ? null : 'buy')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  Buy
                  <ChevronDown className="h-4 w-4" />
                </button>
                <DropdownMenu items={buyOptions} isOpen={openDropdown === 'buy'} />
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'rent' ? null : 'rent')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  Rent
                  <ChevronDown className="h-4 w-4" />
                </button>
                <DropdownMenu items={rentOptions} isOpen={openDropdown === 'rent'} />
              </div>
              
              <NavLink href="#">Auction</NavLink>
              <NavLink href="Contact Us">Contact</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hidden lg:block text-sm font-medium text-blue-600 hover:text-blue-700">
              Sell
            </button>
            <LanguageSelector 
              isOpen={isLanguageOpen}
              onToggle={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setOpenDropdown(null);
              }}
            />
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Sign in
            </button>
            <button className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/50">
          <img 
            src={housevia}
            alt="Modern house" 
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="relative px-10 pt-20">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="mb-20 text-5xl font-bold">
              Perfect Firm For Selling<br />
              Or renting Houses, Cars,<br />
              And Land
            </h1>

            {/* Search Form */}
            <div className=" p-10 bg-white rounded-lg shadow-lg">
              <form onSubmit={handleSearch} className=" grid grid-cols-6 gap-6">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Looking for</label>
                  <select 
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.lookingFor}
                    onChange={(e) => setFilters({...filters, lookingFor: e.target.value})}
                  >
                    <option value="">Select type</option>
                    <option value="buying">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Property Type</label>
                  <select 
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  >
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Property size</label>
                  <input
                    type="text"
                    placeholder="Any size"
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.propertySize}
                    onChange={(e) => setFilters({...filters, propertySize: e.target.value})}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Your Budget</label>
                  <input
                    type="text"
                    placeholder="Enter budget"
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.budget}
                    onChange={(e) => setFilters({...filters, budget: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                <label className="mb- text-sm text-black font-bold"></label>
                <button 
                  type="submit"
                  className=" p-2 text-white bg-blue-600 rounded-md  flex Search Property justify-center "
                >
                  <Search size={40} />
                  Search Property
                </button>
                </div>

                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default HomePage;