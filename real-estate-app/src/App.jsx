import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./Pages/Home/Home";
import AllProducts from "./Pages/Home/AllProducts";
import ContactPage from "./Pages/Home/Contact Us";
import Sell from "./Pages/Home/Sell";
import Auth from "./Pages/auth";
import ProductDetails from "./Pages/product/Pdetails";
import ResidentialListings from "./Pages/Home/residential";
import CommercialListings from "./Pages/Home/commercial";
import VacationListings from "./Pages/Home/Vacation";
import BuyHouse from "./Pages/Home/BuyHouse";
import BuyLand from "./Pages/Home/BuyLand";
import BuyApartment from "./Pages/Home/BuyApartment";
import BuyResidential from "./Pages/Home/BuyResidential";
import WishList from "./Components/wishlist/WishList";
import { Navbar } from "./Components/NavBar";
import ProfilePage from "./Pages/userPages/ProfilePage";
import ChatInterface from "./Components/ChatInterface";
import ChatPage from "./Pages/ChatPage";
import ClientChatPage from "./Pages/ClientChatPage";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
     <Toaster/>   
      <Routes>
        <Route path="/" element={<Home />} />
        {/* rental pages */}
        <Route path="/rent/residential" element={<ResidentialListings />} />
        <Route path="/rent/commercial" element={<CommercialListings />} />
        <Route path="/rent/vacation" element={<VacationListings />} />
        {/* rental pages */}
        {/* buy pages */}
        <Route path="/buy/houses" element={<BuyHouse />} />
        <Route path="/buy/land" element={<BuyLand />} />
        <Route path="/buy/apartment" element={<BuyApartment />} />
        <Route path="/buy/residential" element={<BuyResidential />} />
        {/* wishlist page */}
        <Route path="/wishlist" element={<WishList />} />
        {/*end of wishlist page */}
        <Route path="/all" element={<AllProducts />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/Contact Us" element={<ContactPage />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/client/deals" element={<ClientChatPage />} />
        <Route path="/auth" element={<Auth />} />
        {/*chat page */}
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
