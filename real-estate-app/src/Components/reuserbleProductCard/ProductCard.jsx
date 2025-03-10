import { Heart, Share2, MapPin, Bath, Bed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const ProductCard = ({ product, onToggleWishlist, isWishlisted = false }) => {
  const API_URL = "http://localhost:5000";
  const CLIENT_URL = "http://localhost:3000";
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { user } = useAuth(); // Get authentication state
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: `Check out this listing: ${product.title}`,
        url: `${CLIENT_URL}/product/${product.slug}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    // Check authentication first
    if (!user) {
      toast.error("Please login to save items to your wishlist");
      return;
    }

    if (isWishlistLoading) return;

    setIsWishlistLoading(true);

    try {
      if (onToggleWishlist) {
        await onToggleWishlist(product._id); // Call the parent's wishlist handler
      }

      // Show toast based on the new wishlist state
      if (isWishlisted) {
        toast.success("Item removed from wishlist", { duration: 2000 });
      } else {
        toast.success("Item added to wishlist", { duration: 2000 });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist. Please try again later.", {
        duration: 2000,
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3]">
          <img
            src={`${API_URL}${product.displayImage}` || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleWishlistClick}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Add to favorites"
            >
              <Heart
                size={20}
                className={
                  isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"
                }
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleShare();
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Share listing"
            >
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
              {product.type}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <span
              className={`px-3 py-1 text-sm text-white rounded-full shadow-md ${
                product.status === "available"
                  ? "bg-green-500"
                  : product.status === "sold"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm line-clamp-1">{product.location}</span>
          </div>

          {/* Property Details */}
          <div className="flex gap-4 mb-4 text-gray-600">
            {product.beds > 0 && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span className="text-sm">{product.beds} Beds</span>
              </div>
            )}
            {product.baths > 0 && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span className="text-sm">{product.baths} Baths</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
