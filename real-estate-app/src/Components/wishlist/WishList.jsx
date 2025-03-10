import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../../services/wishlist";
import LoadingSkeleton from "./LoadingSkeleton";
import ZeroWishList from "./ZeroWishList";
import WishlistCard from "./WishlistCard";

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        const { wishlistItems } = await fetchWishlist();
        setWishlistItems(wishlistItems);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleToggleWishlist = async (productId) => {
    try {
      // Check if the item is already in the wishlist
      const isItemInWishlist = wishlistItems.some(item => item.product._id === productId);
  
      if (isItemInWishlist) {
        // Remove item from local state immediately for better UX
        setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
  
       
        await removeFromWishlist(productId);
      } else {
        // Add item to the wishlist
        // Fetch the product details (if needed) and add it to the wishlist
        // const productToAdd = await fetchProductDetails(productId); // Replace with your API call
        // setWishlistItems(prev => [...prev, { product: productToAdd }]);
  
        // Show success toast for addition
        toast.success("Item added to wishlist");
  
        // Here you would typically also make an API call to add the item to the backend
         await addToWishlist(productId);
      }
    } catch (error) {
      // If the API call fails, revert the local state change
      toast.error("Failed to update wishlist. Please try again later.");
  
      // Reload the wishlist to ensure consistency
      const { wishlistItems } = await fetchWishlist();
      setWishlistItems(wishlistItems);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!wishlistItems?.length) {
    return <ZeroWishList />;
  }

  return (
    <div className="container mx-auto px-4">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8"
      >
        My Wishlist
      </motion.h1>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <WishlistCard 
                item={item} 
                onToggleWishlist={handleToggleWishlist}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WishList;
