import { Bath, Bed, MapPin, Home } from "lucide-react"

export const PropertyFeatures = ({ beds, baths, location, type }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-100 rounded-lg overflow-x-auto break-words whitespace-normal">
      {beds > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-2 bg-white rounded-full">
            <Bed className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Bedrooms</p>
            <p className="font-medium">{beds}</p>
          </div>
        </div>
      )}

      {baths > 0 && (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-full">
            <Bath className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Bathrooms</p>
            <p className="font-medium">{baths}</p>
          </div>
        </div>
      )}

      {location && (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-full">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{location}</p>
          </div>
        </div>
      )}

      {type && (
        <div className="flex items-center gap-2 ">
          <div className="p-2 bg-white rounded-full">
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium capitalize text-sm">{type}</p>
          </div>
        </div>
      )}
    </div>
  )
}

