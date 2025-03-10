import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FilePlus,
  Users,
  Settings,
  BarChart3,
  FileText,
  CreditCard,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ChevronUp,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";



const API_URL = "http://localhost:5000";

const NavItem = ({ to, icon, label, isActive, isCollapsed }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
        isActive
          ? "bg-gray-100/10 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-100/5"
      } ${isCollapsed ? "justify-center" : ""}`}
    >
      <div className="text-xl">{icon}</div>
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dropUpOpen, setDropUpOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const dropUpRef = useRef(null);
  
 
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/all-products", icon: <Package size={20} />, label: "All Products" },
    { to: "/new-product", icon: <FilePlus size={20} />, label: "Add Product" },
    { to: "/messages", icon: <ShoppingCart size={20} />, label: "Messages" },
    { to: "/customers", icon: <Users size={20} />, label: "Customers" },
    { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { to: "/reports", icon: <FileText size={20} />, label: "Reports" },
    { to: "/payments", icon: <CreditCard size={20} />, label: "Payments" },
    { to: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  // Close the drop-up menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropUpRef.current && !dropUpRef.current.contains(event.target)) {
        setDropUpOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropUpRef]);

  return (
    <div
      className={`bg-gray-900 text-white h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } py-5 px-4 border-b border-gray-800`}
      >
        {!collapsed && <h1 className="text-xl font-semibold">AdminPanel</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
            isCollapsed={collapsed}
          />
        ))}
      </div>

      <div
        className={`p-4 border-t border-gray-800 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`flex flex-col items-start w-full ${
            collapsed ? "gap-4" : "justify-between h-full"
          }`}
        >
          <div
            ref={dropUpRef}
            className={`profile relative w-full ${
              collapsed ? "flex justify-center " : ""
            }`}
          >
            <button
              onClick={() => {
                if (collapsed) {
                  setCollapsed(false);
                  setDropUpOpen(!dropUpOpen);
                } else {
                  setDropUpOpen(!dropUpOpen); // Toggle drop-up menu if sidebar is already open
                }
              }}
              className={`flex items-center gap-3 w-full ${
                collapsed ? "justify-center " : "justify-between "
              } hover:bg-gray-800 p-2 rounded-md transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage.startsWith('http') ? user.profileImage : `${API_URL}${user.profileImage}`}
                      alt={`${user.name} Profile Image`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Users size={16} />
                  )}
                </div>
                {!collapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronUp size={16} className={`transform transition-transform ${dropUpOpen ? 'rotate-180' : ''}`} />}
            </button>
            
            {/* Drop-up Menu */}
            {dropUpOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 rounded-md shadow-lg py-2 z-10">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </Link>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
          
          {/* If collapsed, show only the logout button below */}
          {collapsed && (
            <div className="w-full flex justify-center py-1">
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors flex gap-6 items-center cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
