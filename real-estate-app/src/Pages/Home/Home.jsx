import React from 'react';
import HomePage from '../../Components/HomePage';
import ProductPage from '../../Components/ProductPage';
import FeaturePage from '../../Components/FeaturePage';
import LocationPage from '../../Components/LocationPage';
import LandingPage from '../../Components/LandingPage';
import TestimonialsPage from '../../Components/TestimonialsPage';
import PartnersPage from '../../Components/PartnersPage';
import FooterPage from '../../Components/FooterPage';

const Home = () => {
  return (
    <div>
      <HomePage />
      <ProductPage />
      <FeaturePage />
      <LocationPage />
      <LandingPage />
      <TestimonialsPage />
      <PartnersPage />
      <FooterPage />
    </div>
  );
};

export default Home;