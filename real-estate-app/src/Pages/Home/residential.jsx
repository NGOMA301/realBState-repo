import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../../services/wishlist";
import ProductCard from "../../Components/reuserbleProductCard/ProductCard";
const ResidentialListings = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);

  const ITEMS_PER_PAGE = 12;

  const fetchProducts = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        category: "Residential",
      });

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
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Residential Properties
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

export default ResidentialListings;