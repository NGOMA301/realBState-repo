import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import AllProducts from './Pages/Home/AllProducts';
import ContactPage from './Pages/Home/Contact Us';
import Sell from './Pages/Home/Sell';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AllProducts" element={<AllProducts />} />
        <Route path='/Contact Us' element={<ContactPage />} />
        <Route path='/Sell' element={<Sell />} />
      </Routes>
   
  );
}

export default App;