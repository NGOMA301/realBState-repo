import { ChevronDown, User, Heart, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export function UserMenu({ lastName, isOpen, onToggle, onLogout }) {
  return (
    <div className="relative">
      <button
        className="dropdown-trigger flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
        onClick={onToggle}
      >
        {lastName}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}