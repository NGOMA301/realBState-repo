import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ZeroWishList = () => {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 21V3.5H20.5V21L12 15.5L3.5 21Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-4">Start browsing properties to add them to your wishlist</p>
        <Link 
          to={'/'} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    </motion.div>
  );
};

export default ZeroWishList;