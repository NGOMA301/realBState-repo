import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { Navbar } from "../../Components/NavBar";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../../services/wishlist";
import ProductCard from "../../Components/reuserbleProductCard/ProductCard";
// import ProductCard from "../../Components/ProductCard"; // Import ProductCard
// import {
//   addToWishlist,
//   fetchWishlist,
//   removeFromWishlist,
// } from "../../services/wishlist";

const AllProducts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);

  const ITEMS_PER_PAGE = 12;

  const categories = [
    { id: "all", label: "View All" },
    { id: "Residential", label: "Residential" },
    { id: "Commercial", label: "Commercial" },
    { id: "Land", label: "Land" },
    { id: "Industrial", label: "Industrial" },
    { id: "Luxury", label: "Luxury" },
    { id: "Vacation Rentals", label: "Vacation Rentals" },
  ];

  const fetchProducts = useCallback(
    async (currentPage) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
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
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory]
  );

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">New Listings</h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setPage(1);
              }}
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

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;