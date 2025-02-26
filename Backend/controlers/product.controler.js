import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Product } from "../models/product.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import { User } from "../models/user.model.js";

//create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      category,
      status,
      location,
      beds,
      baths,
    } = req.body;
    console.log(req.body);

    if (!req.files || !req.files.displayImage || !req.files.images) {
      return res
        .status(400)
        .json({ message: "Display image and product images are required" });
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    // Get file paths
    const displayImage = `/uploads/display-image/${req.files.displayImage[0].filename}`;
    const images = req.files.images.map(
      (file) => `/uploads/product-image/${file.filename}`
    );

    // Create the product
    const product = new Product({
      title,
      slug,
      description,
      price,
      type,
      category: category.split(","), // Assuming category is passed as a comma-separated string
      displayImage,
      image: images,
      status,
      location,
      beds: beds ? Number(beds) : undefined,
      baths: baths ? Number(baths) : undefined,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort, type } = req.query;

    // Convert query parameters to proper formats
    const pageNumber = Math.max(1, parseInt(page, 10)); // Ensure positive integer
    const limitNumber = Math.max(1, parseInt(limit, 10)); // Ensure positive integer
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object dynamically
    const filter = {};

    if (category) {
      filter.category = { $in: category.split(",") }; // Supports multiple categories
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (type) {
      filter.type = type; // Filter by type (e.g., "House", "Apartment")
    }

    // Sorting configuration
    const sortOptions = {};
    if (sort) {
      const [key, order] = sort.split(":"); // Example: sort=price:asc or sort=price:desc
      sortOptions[key] = order === "desc" ? -1 : 1;
    }

    // Fetch products with filtering, pagination, and sorting
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    // Get total count of products matching the filter
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
      pagination: {
        total: totalProducts,
        page: pageNumber,
        pages: Math.ceil(totalProducts / limitNumber),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
};

//update a product
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       title,
//       description,
//       price,
//       type,
//       category,
//       status,
//       location,
//       beds,
//       baths,
//     } = req.body;

//     // Check if the product exists
//     const existingProduct = await Product.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Generate slug only if the title is updated
//     const slug = title
//       ? title.toLowerCase().replace(/\s+/g, "-")
//       : existingProduct.slug;

//     // Update file paths if new files are uploaded
//     let displayImage = existingProduct.displayImage;
//     if (req.files && req.files.displayImage) {
//       displayImage = `/uploads/display-image/${req.files.displayImage[0].filename}`;
//     }

//     let images = existingProduct.image;
//     if (req.files && req.files.images) {
//       images = req.files.images.map(
//         (file) => `/uploads/product-image/${file.filename}`
//       );
//     }

//     // Update product fields
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         title: title || existingProduct.title,
//         slug,
//         description: description || existingProduct.description,
//         price: price || existingProduct.price,
//         type: type || existingProduct.type,
//         category: category ? category.split(",") : existingProduct.category,
//         status: status || existingProduct.status,
//         location: location || existingProduct.location,
//         beds: beds ? Number(beds) : existingProduct.beds,
//         baths: baths ? Number(baths) : existingProduct.baths,
//         displayImage,
//         image: images,
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       message: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred", error: error.message });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      category,
      status,
      location,
      beds,
      baths,
    } = req.body;
    let { removedImages } = req.body;

    // Ensure `removedImages` is parsed and defaults to an array
    if (typeof removedImages === "string") {
      removedImages = JSON.parse(removedImages); // Parse JSON string if necessary
    }
    removedImages = Array.isArray(removedImages) ? removedImages : [];

    console.log("removedImages:", removedImages);

    // Find the product
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Generate slug only if the title is updated
    if (title) {
      product.slug = title.toLowerCase().replace(/\s+/g, "-");
    }

    // Remove images from the server and database
    if (removedImages && removedImages.length > 0) {
      removedImages.forEach((image) => {
        const filePath = path.join(__dirname, "..", image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the file from the server
        }
        // Remove the image path from the product's images array
        product.image = product.image.filter((img) => img !== image);
      });
    }

    // Add newly uploaded images
    if (req.files.newImages) {
      const newImages = req.files.newImages.map(
        (file) => `/uploads/product-image/${file.filename}`
      );
      product.image.push(...newImages);
    }

    // Update other fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.type = type || product.type;
    product.category = category ? category.split(",") : product.category;
    product.status = status || product.status;
    product.location = location || product.location;
    product.beds = !isNaN(beds) && beds !== "" ? Number(beds) : product.beds;
    product.baths =
      !isNaN(baths) && baths !== "" ? Number(baths) : product.baths;
    // beds ? Number(beds) : existingProduct.beds;
    //baths: baths ? Number(baths) : existingProduct.baths,

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

//get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the product ID from the request parameters

    // Find the product by its ID
    const product = await Product.findById(id);

    // If no product is found, return a 404 response
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the found product
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "An error occurred while fetching the product",
      error: error.message,
    });
  }
};

// Delete a product and its images
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from the filesystem
    const deleteFile = (filePath) => {
      const fullPath = path.join(__dirname, "..", "public", filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    };

    // Delete display image
    deleteFile(product.displayImage);

    // Delete all product images
    product.image.forEach((img) => deleteFile(img));

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Get product details by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the product by slug
    const product = await Product.findOne({ slug });

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

//add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const existingWishlistItem = await Wishlist.findOne({
      user: userId,
      product: productId,
    });
    if (existingWishlistItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = new Wishlist({ user: userId, product: productId });
    await wishlistItem.save();

    // Update user's wishlist array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(201)
      .json({ message: "Product added to wishlist", wishlistItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

//remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlistItem = await Wishlist.findOneAndDelete({
      user: userId,
      product: productId,
    });
    if (!wishlistItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove from user's wishlist array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    res.status(200).json({
      message: "Product removed from wishlist",
      userWishlist: user.wishlist,
    });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

//get all wishlists for the current user
export const getAllWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlistItems = await Wishlist.find({ user: userId }).populate(
      "product"
    );
    res.status(200).json({ wishlistItems });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
