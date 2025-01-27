import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div>
       <section class="py-12">
        <div class="max-w-7xl mx-auto px-6 sm:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-blue-600 mb-6">Contact Us</h1>
                <p class="text-lg text-gray-600">We'd love to hear from you! Reach out to us via any of the below channels.</p>
            </div>

            <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {/* Phone Number */}
                <div class="flex items-center justify-center p-6 bg-white shadow-lg rounded-lg hover:bg-blue-50 transition duration-300">
                    <div class="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                    <Phone className="h-4 w-4" />
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold">Phone</h3>
                        <p class="text-gray-500">0785126033</p>
                    </div>
                </div>

                {/* <!-- Email --> */}
                <div class="flex items-center justify-center p-6 bg-white shadow-lg rounded-lg hover:bg-blue-50 transition duration-300">
                    <div class="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                        <Mail className="h-4 w-4" />
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold">Email</h3>
                        <p class="text-gray-500">contact@company.com</p>
                    </div>
                </div>

                {/* <!-- Location --> */}
                <div class="flex items-center justify-center p-6 bg-white shadow-lg rounded-lg hover:bg-blue-50 transition duration-300">
                    <div class="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                        <MapPin className="h-4 w-4" />
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold">Location</h3>
                        <p class="text-gray-500">1234 Some St, City, Country</p>
                    </div>
                </div>

                {/* <!-- WhatsApp --> */}
                <div class="flex items-center justify-center p-6 bg-white shadow-lg rounded-lg hover:bg-blue-50 transition duration-300">
                    <div class="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                        <FaWhatsapp  className="h-4 w-4" />
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold">WhatsApp</h3>
                        <p class="text-gray-500">0785126033</p>
                    </div>
                </div>

                {/* <!-- Telegram --> */}
                <div class="flex items-center justify-center p-6 bg-white shadow-lg rounded-lg hover:bg-blue-50 transition duration-300">
                    <div class="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full">
                        <FaTelegram  className="h-4 w-4" />
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold">Telegram</h3>
                        <p class="text-gray-500">0785126033</p>
                    </div>
                </div>
            </div>

            {/* <!-- Social Media Links --> */}
            <div class="mt-12 text-center">
                <h3 class="text-xl font-semibold mb-4">Follow Us</h3>
                <div class="flex justify-center gap-6 text-blue-600">
                    {/* <!-- Facebook --> */}
                    <a href="#" class="hover:text-blue-800 transition duration-200">
                        <Facebook className="h-5 w-5" />
                    </a>
                    {/* <!-- Twitter --> */}
                    <a href="#" class="hover:text-blue-400 transition duration-200">
                       <Twitter className="h-5 w-5" />
                    </a>
                     {/* <!-- Instagram --> */}
                    <a href="#" class="hover:text-pink-500 transition duration-200">
                        <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" class="hover:text-pink-500 transition duration-200">
                        <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" class="hover:text-pink-500 transition duration-200">
                        <Youtube className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default ContactPage
