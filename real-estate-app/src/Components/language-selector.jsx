import { Globe, ChevronDown } from "lucide-react"

export const LanguageSelector = ({ isOpen, onToggle, selectedLanguage, onLanguageSelect }) => {
  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "rw", label: "Ikinyarwanda" },
  ]

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{languages.find((lang) => lang.code === selectedLanguage)?.label || "English"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute right-0 top-full mt-1 w-40 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              onLanguageSelect(lang.code)
              onToggle()
            }}
            className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
              selectedLanguage === lang.code
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}

