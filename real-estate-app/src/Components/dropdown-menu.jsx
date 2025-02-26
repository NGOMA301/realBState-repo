import { Link } from "react-router-dom"

export const DropdownMenu = ({ items, isOpen }) => (
  <div
    className={`absolute top-full left-0 mt-1 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
      isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
    }`}
  >
    <div className="py-1">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  </div>
)

