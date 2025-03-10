import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Heart, Share2 } from "lucide-react";
import { ImageGallery } from "../../Components/product-details/image-gallery";
import { PropertyFeatures } from "../../Components/product-details/property-features";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, fetchUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  // Fetch user's wishlist when component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/product/wishlist/all",
            { withCredentials: true }
          );
          setWishlist(
            response.data.wishlistItems.map((item) => item.product._id)
          );
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  // Check if current product is in wishlist
  const isWishlisted = wishlist.includes(product?._id);

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }

    if (isWishlistLoading) return;
    setIsWishlistLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5000/api/product/wishlist/remove/${product._id}`,
          { withCredentials: true }
        );
        setWishlist((prev) => prev.filter((id) => id !== product._id));
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:5000/api/product/wishlist/add-to-wishlist",
          { productId: product._id },
          { withCredentials: true }
        );
        setWishlist((prev) => [...prev, product._id]);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.response?.data?.message || "Wishlist operation failed");
    } finally {
      setIsWishlistLoading(false);
      fetchUser(); // Refresh user data if needed
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/product/details/${slug}`
        );
        setProduct(response.data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Update document title
  useEffect(() => {
    if (product) {
      document.title = `${product.title}`;
    }
    return () => {
      document.title = "Real Estate";
    };
  }, [product]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleContactAgent = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/chat/conversation`,
        {
          recipientId: product.createdBy,
          productId: product._id,
        },
        { withCredentials: true }
      );

      navigate(`/chat/${response.data._id}`, { state: { product } });
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Gallery */}
            <div>
              <ImageGallery
                images={[product.displayImage, ...product.image]}
                title={product.title}
              />
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        product.status === "available"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Sold"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Listed {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleWishlistClick}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    disabled={isWishlistLoading}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isWishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600"
                      } ${isWishlistLoading ? "opacity-50" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Share listing"
                  >
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b py-4">
                <div className="text-3xl font-bold text-blue-600">
                  ${product.price.toLocaleString()}
                </div>
              </div>

              {/* Features */}
              <PropertyFeatures
                beds={product.beds}
                baths={product.baths}
                location={product.location}
                type={product.type}
              />

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {product.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <div className="pt-6">
                <button
                  onClick={handleContactAgent}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
