import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../services/wishlist";
import ProductCard from "./reuserbleProductCard/ProductCard";

const ProductPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const categories = [
    { id: "all", label: "View All" },
    { id: "Residential", label: "Residential" },
    { id: "Commercial", label: "Commercial" },
    { id: "Land", label: "Land" },
    { id: "Industrial", label: "Industrial" },
    { id: "Luxury", label: "Luxury" },
    { id: "Vacation Rentals", label: "Vacation Rentals" },
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: 6,
      });

      if (activeCategory !== "all") {
        queryParams.append("category", activeCategory);
      }

      if (activeCategory === "all") {
        queryParams.append("sort", "createdAt:desc");
      }

      const response = await axios.get(
        `http://localhost:5000/api/product/all?${queryParams.toString()}`
      );
      setListings(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Wishlist functionality
  useEffect(() => {
    const getWishlist = async () => {
      try {
        const response = await fetchWishlist();
        setWishlist(response.wishlistItems.map((item) => item.product._id));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    getWishlist();
  }, []);

  const handleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div className="px-4 py-12 mx-auto max-w-7xl">
      <h2 className="mb-8 text-2xl text-center font-semibold">New Listings</h2>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-2 rounded-full transition-all duration-200 ${
              activeCategory === category.id
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Listings Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ProductCard
              key={listing._id}
              product={listing}
              onToggleWishlist={handleWishlist}
              isWishlisted={wishlist.includes(listing._id)}
            />
          ))}
        </div>
      )}

      {/* View More Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/all")}
          className="px-6 py-3 text-green-600 border-2 border-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
        >
          View all properties →
        </button>
      </div>
    </div>
  );
};

export default ProductPage;