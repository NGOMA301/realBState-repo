import React, { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit2,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  FileDown,
  Printer,
  MoreHorizontal,
} from "lucide-react";
import debounce from "lodash/debounce";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast"; // Import react-hot-toast

const AllProducts = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const API_URL = "http://localhost:5000";

  // Memoize the fetch function
  const fetchProducts = useCallback(async ({ queryKey }) => {
    const [_, currentPage, search, status] = queryKey;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/product/all?page=${currentPage}&limit=10${
          search ? `&search=${search}` : ""
        }${status !== "all" ? `&status=${status}` : ""}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }, []);

  // Use React Query for data fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, searchTerm, selectedStatus],
    queryFn: fetchProducts,
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 5000, // Consider data fresh for 5 seconds
    cacheTime: 300000, // Cache data for 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`http://localhost:5000/api/product/delete/${id}`),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["products"]);

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData([
        "products",
        page,
        searchTerm,
        selectedStatus,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["products", page, searchTerm, selectedStatus],
        (old) => ({
          ...old,
          products: old.products.filter((product) => product._id !== deletedId),
        })
      );

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (err, deletedId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["products", page, searchTerm, selectedStatus],
        context.previousProducts
      );

      toast.error("Failed to delete product. Please try again.");
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync
      queryClient.invalidateQueries(["products"]);
    },
  });

  // Memoize handlers
  const handleNextPage = useCallback(() => {
    if (page < (data?.pagination?.pages || 1)) {
      setPage((p) => p + 1);
    }
  }, [page, data?.pagination?.pages]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }, [page]);

  const handleView = useCallback(
    (id) => {
      navigate(`/update-product/${id}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (e, id) => {
      e.stopPropagation();
      navigate(`/update-product/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (e, id) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this product?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setPage(1); // Reset to first page on search
      }, 300),
    []
  );

  // Memoize the products list
  const products = useMemo(() => data?.products || [], [data?.products]);
  const totalPages = useMemo(
    () => data?.pagination?.pages || 1,
    [data?.pagination?.pages]
  );

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPage(1); // Reset to first page on filter change
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
        <div className="container mx-auto py-8 px-4 lg:px-6">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <Link
                to="/new-product"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} />
                Add Product
              </Link>
            </div>
            <p className="text-gray-500">
              Manage your product inventory, prices, and listings.
            </p>
          </div>

          {/* Tools section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative col-span-3 md:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="col-span-3 md:col-span-2 flex flex-wrap gap-2 items-center justify-end">
                <div className="flex items-center">
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50">
                  <Filter size={14} />
                  More Filters
                </button>

                <button className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50">
                  <FileDown size={14} />
                  Export
                </button>

                <button className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50">
                  <Printer size={14} />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Table section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {isError ? (
              <div className="p-8 text-center">
                <div className="mb-4 text-red-500 bg-red-50 p-4 rounded-lg inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>Failed to load products.</p>
                </div>
                <button
                  onClick={() => queryClient.invalidateQueries(["products"])}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Beds
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Baths
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4">
                              <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-14 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-8 w-16 bg-gray-200 rounded"></div>
                            </td>
                          </tr>
                        ))
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <tr
                          key={product._id}
                          onClick={() => handleView(product._id)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3">
                                {product.displayImage &&
                                product.displayImage ? (
                                  <img
                                    src={`${API_URL}${product.displayImage}`}
                                    alt={product.title}
                                    className="h-10 w-10 object-cover rounded"
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded text-gray-400 text-xs">
                                    No IMG
                                  </div>
                                )}
                              </div>
                              <div className="font-medium text-gray-900 truncate max-w-xs">
                                {product.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.category?.join(", ")}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                product.status === "available"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "sold"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.location}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {product.beds || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {product.baths || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleEdit(e, product._id)}
                                className="text-gray-600 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, product._id)}
                                className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                title="Delete"
                                disabled={
                                  deleteMutation.isLoading &&
                                  deleteMutation.variables === product._id
                                }
                              >
                                {deleteMutation.isLoading &&
                                deleteMutation.variables === product._id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-gray-400 mb-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            <p className="text-lg font-medium text-gray-600 mb-1">
                              No products found
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              Try adjusting your search or filter to find what
                              you're looking for.
                            </p>
                            <Link
                              to="/new-product"
                              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                            >
                              Add a new product
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination section */}
          {!isLoading && products.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {products.length > 0 ? (page - 1) * 10 + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * 10, data?.pagination?.total || 0)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {data?.pagination?.total || 0}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        page === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pageNumber
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default AllProducts;
