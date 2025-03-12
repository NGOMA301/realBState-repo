import { useState } from "react"
import { Search } from "lucide-react"
import housevia from "../Assets/housevia.png"

const HomePage = () => {
  const [filters, setFilters] = useState({
    lookingFor: "",
    location: "",
    propertyType: "",
    propertySize: "",
    budget: "",
  })

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Search filters:", filters)
    // Here you would typically make an API call with the filters
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/50">
          <img src={housevia || "/placeholder.svg"} alt="Modern house" className="object-cover w-full h-full" />
        </div>

        <div className="relative px-10 pt-20">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="mb-20 text-5xl font-bold">
              Perfect Firm For Selling
              <br />
              Or renting Houses, Cars,
              <br />
              And Land
            </h1>

            {/* Search Form */}
            <div className="p-10 bg-white rounded-lg shadow-lg">
              <form onSubmit={handleSearch} className="grid grid-cols-6 gap-6">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Looking for</label>
                  <select
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.lookingFor}
                    onChange={(e) => setFilters({ ...filters, lookingFor: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="buying">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Property Type</label>
                  <select
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Property size</label>
                  <input
                    type="text"
                    placeholder="Any size"
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.propertySize}
                    onChange={(e) => setFilters({ ...filters, propertySize: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">Your Budget</label>
                  <input
                    type="text"
                    placeholder="Enter budget"
                    className="p-2 border rounded-md border-gray-300 text-gray-800"
                    value={filters.budget}
                    onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm text-black font-bold">&nbsp;</label>
                  <button
                    type="submit"
                    className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Property</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

