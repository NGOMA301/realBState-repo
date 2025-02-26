import ProductCard from "../reuserbleProductCard/ProductCard";


const WishlistCard = ({ item, onToggleWishlist }) => {
  return (
    <ProductCard 
      product={item.product} 
      onToggleWishlist={onToggleWishlist} 
      isWishlisted={true}
    />
  );
};

export default WishlistCard;