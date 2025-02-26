import React, { useCallback, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Edit2, Search } from "lucide-react"
import debounce from "lodash/debounce"

const AllProducts = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [page, setPage] = React.useState(1)

  // Memoize the fetch function
  const fetchProducts = useCallback(async ({ queryKey }) => {
    const [_, currentPage, search] = queryKey
    const { data } = await axios.get(
      `http://localhost:5000/api/product/all?page=${currentPage}&limit=10${search ? `&search=${search}` : ""}`,
    )
    return data
  }, [])

  // Use React Query for data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["products", page, searchTerm],
    queryFn: fetchProducts,
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 5000, // Consider data fresh for 5 seconds
    cacheTime: 300000, // Cache data for 5 minutes
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:5000/api/product/delete/${id}`),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["products"])

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(["products", page, searchTerm])

      // Optimistically update to the new value
      queryClient.setQueryData(["products", page, searchTerm], (old) => ({
        ...old,
        products: old.products.filter((product) => product._id !== deletedId),
      }))

      // Return a context object with the snapshotted value
      return { previousProducts }
    },
    onError: (err, deletedId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["products", page, searchTerm], context.previousProducts)
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync
      queryClient.invalidateQueries(["products"])
    },
  })

  // Memoize handlers
  const handleNextPage = useCallback(() => {
    if (page < (data?.pagination?.pages || 1)) {
      setPage((p) => p + 1)
    }
  }, [page, data?.pagination?.pages])

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage((p) => p - 1)
    }
  }, [page])

  const handleView = useCallback(
    (id) => {
      navigate(`/update-product/${id}`)
    },
    [navigate],
  )

  const handleEdit = useCallback(
    (e, id) => {
      e.stopPropagation()
      navigate(`/update-product/${id}`)
    },
    [navigate],
  )

  const handleDelete = useCallback(
    (e, id) => {
      e.stopPropagation()
      if (window.confirm("Are you sure you want to delete this product?")) {
        deleteMutation.mutate(id)
      }
    },
    [deleteMutation],
  )

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value)
        setPage(1) // Reset to first page on search
      }, 300),
    [],
  )

  // Memoize the products list
  const products = useMemo(() => data?.products || [], [data?.products])
  const totalPages = useMemo(() => data?.pagination?.pages || 1, [data?.pagination?.pages])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Product List</h1>
          <Link
            to="/new-product"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            Add New Product
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Beds</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Baths</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                        <span>Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      onClick={() => handleView(product._id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4">{product.title}</td>
                      <td className="px-6 py-4">{product.type}</td>
                      <td className="px-6 py-4">{product.category.join(", ")}</td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
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
                      <td className="px-6 py-4">{product.location}</td>
                      <td className="px-6 py-4">{product.beds || "-"}</td>
                      <td className="px-6 py-4">{product.baths || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleEdit(e, product._id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, product._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Delete"
                            disabled={deleteMutation.isLoading}
                          >
                            {deleteMutation.isLoading && deleteMutation.variables === product._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 rounded-full animate-spin border-t-transparent"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllProducts

