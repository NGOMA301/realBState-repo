import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import { NavLink } from "./nav-link";
import { DropdownMenu } from "./dropdown-menu";
import { LanguageSelector } from "./language-selector";
import { MobileMenu } from "./mobile-menu";
import { useAuth } from "../hooks/useAuth";
import { UserMenu } from "./user-menu";

const buyOptions = [
  { id: "houses", label: "Houses", href: "/buy/houses" },
  { id: "apartment", label: "Apartments", href: "/buy/apartment" },
  { id: "land", label: "Land", href: "/buy/land" },
  { id: "residential", label: "Residential", href: "/buy/residential" },
];

const rentOptions = [
  { id: "residential", label: "Residential", href: "/rent/residential" },
  { id: "commercial", label: "Commercial", href: "/rent/commercial" },
  { id: "Vacation Rentals", label: "Vacation", href: "/rent/vacation" },
];

const navItems = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "buy",
    label: "Buy",
    href: "/buy",
    children: buyOptions,
  },
  {
    id: "rent",
    label: "Rent",
    href: "/rent",
    children: rentOptions,
  },
  { id: "auction", label: "Auction", href: "/auction" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-trigger")) {
        setOpenDropdown(null);
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest(".language-selector")) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setOpenDropdown(null);
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl justify-between px-4 py-4">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-bold">
            Real Estate
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                {item.children ? (
                  <>
                    <button
                      className={`dropdown-trigger flex items-center gap-1 text-sm font-medium ${
                        location.pathname.startsWith(item.href)
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === item.id ? null : item.id
                        );
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdown === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <DropdownMenu
                      items={item.children}
                      isOpen={openDropdown === item.id}
                    />
                  </>
                ) : (
                  <NavLink
                    to={item.href}
                    isActive={location.pathname === item.href}
                    className="text-gray-600 hover:text-blue-600" // Add base styles here
                    activeClassName="text-blue-600" // Add active style here
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/sell"
            className="hidden lg:block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Sell
          </Link>
          <div className="language-selector">
            <LanguageSelector
              isOpen={isLanguageOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setIsLanguageOpen(!isLanguageOpen);
                setOpenDropdown(null);
              }}
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
          {!loading && (
            <>
              {user ? (
                <UserMenu
                  lastName={user.name.split(" ").pop() || ""}
                  isOpen={isUserMenuOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setOpenDropdown(null);
                  }}
                  onLogout={handleLogout}
                />
              ) : (
                <Link
                  to="/auth"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </>
          )}
          <button
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        currentLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
};
