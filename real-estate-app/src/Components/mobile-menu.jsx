import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  currentLanguage,
  onLanguageSelect,
}) => {
  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "rw", label: "Ikinyarwanda" },
  ];
  const location = useLocation();

  return (
    <div
      className={`fixed inset-0 bg-gray-800/50   transition-opacity duration-200 lg:hidden  ${
        isOpen ? "opacity-100 visible " : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-y-0 right-0  w-64 bg-white overflow-scroll shadow-xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-8 space-y-4">
            {navItems.map((item) => (
              <div key={item.id}>
                <Link
                  to={item.href}
                  className={`block py-2 text-gray-600 hover:text-blue-600 ${
                    location.pathname.startsWith(item.href)
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.href}
                        className="block py-1 text-sm text-gray-500 hover:text-blue-600"
                        onClick={onClose}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Language</p>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageSelect(lang.code);
                  onClose();
                }}
                className={`block w-full px-2 py-1 text-left text-sm rounded-md ${
                  currentLanguage === lang.code
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
