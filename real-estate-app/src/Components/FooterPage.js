/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const FooterPage = () => {
  return (
    <footer className="bg-blue-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className='space-y-4'>
        <h2 className="text-xl font-bold mb-6">Real estate logo</h2>
        </div>
      
         {/* Social Media Icons */}
         <div className="flex gap-4 justify-start">
         <h3 className="font-bold relative mb-5">Follow Us</h3>
              <a href="#" className="hover:text-gray-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
    
        </div>
        <div className="grid grid-cols-1 border-t md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Logo and Info */}
          <div className="space-y-4 my-10">
            <p className="text-sm text-gray-300">
              Specializes in providing high-class hours for those in need. Contact us
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+234 706 000 000</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>contact@email.com</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Our Company */}
          <div>
            <h3 className="font-bold my-10 mb-4">Our Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-300">Services</a></li>
              <li><a href="#" className="hover:text-gray-300">About us</a></li>
              <li><a href="#" className="hover:text-gray-300">News</a></li>
              <li><a href="#" className="hover:text-gray-300">FAQs</a></li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="font-bold my-10 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-300">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-300">Terms of Use</a></li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            {/* Newsletter Form */}
            <div className="mb-4 my-10">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter E-mail Address"
                  className="flex-1 px-4 py-2 rounded text-gray-900 text-sm"
                />
                <br/>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
           
          </div>
        </div>

        {/* Copyright */}
        <div className=" border-blue-700 text-center text-sm text-gray-300">
          <p>© 2024. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
