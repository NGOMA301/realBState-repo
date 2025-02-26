// api/wishlist.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/product";

export const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${API_URL}/wishlist/add-to-wishlist`,
        { productId },
        {
          withCredentials: true,
          
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist/remove/${productId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist/all`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};