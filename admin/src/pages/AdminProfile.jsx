import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Camera,
  Check,
  Lock,
  Save,
  User,
  MapPin,
  Phone,
  Shield,
  Mail,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Sidebar from "../components/Sidebar";
import api from "@/utils/api";
import { TopLoader } from "@/components/TopLoader";

const AdminProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [updatedUser, setUpdatedUser] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: {
      city: "",
      street: "",
    },
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("general");
  const [loadingImage, setLoadingImage] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setPageLoading(true);
        // In a real implementation, you might want to fetch fresh user data here
        // const response = await api.get(`${API_URL}/api/users/profile`);
        // const userData = response.data.user;

        // For now, we'll use the user from auth store
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            address: {
              city: user.address?.city || "",
              street: user.address?.street || "",
            },
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          if (user.profileImage) {
            setPreviewImage(`${API_URL}${user.profileImage}`);
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Error loading profile:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, [user, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev,
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoadingImage(true);
      try {
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));

        toast.success("Image selected successfully");
      } catch (error) {
        toast.error("Error processing image");
        console.error("Error processing image:", error);
      } finally {
        setLoadingImage(false);
      }
    }
  };

  const validatePasswordForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation if in password section
    if (section === "password" && !validatePasswordForm()) {
      return;
    }

    setLoading(true);

    // Create FormData object for submission
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("address.city", formData.address.city);
    formDataToSend.append("address.street", formData.address.street);

    // Add password fields if we're updating password
    if (
      section === "password" &&
      formData.currentPassword &&
      formData.newPassword
    ) {
      formDataToSend.append("currentPassword", formData.currentPassword);
      formDataToSend.append("newPassword", formData.newPassword);
    }

    // Add profile image if selected
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      const response = await api.put(
        `${API_URL}/api/edit/admin/profile`,
        formDataToSend,
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.user) {
        setUpdatedUser(response.data.user);
        
      }

      // Simulate API call for demonstration
      setTimeout(() => {
        // Mock response for demonstration
        const mockUpdatedUser = {
          ...user,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: {
            city: formData.address.city,
            street: formData.address.street,
          },
        };

        setUpdatedUser(mockUpdatedUser);

        // Clear password fields after submission
        if (section === "password") {
          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
        }

        toast.success("Profile updated successfully!");
        setProfileImage(null);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error(error.message || "Error updating profile");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <TopLoader isLoading={pageLoading} />
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Profile
            </h1>
            <p className="text-sm text-gray-500">
              Manage your account information and preferences
            </p>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="md:flex">
                {/* Profile sidebar with image and basic info */}
                <div className="md:w-1/3 bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="relative group mb-4">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transition-all duration-300 ${
                        loadingImage ? "animate-pulse" : ""
                      }`}
                    >
                      <img
                        src={
                          previewImage ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target;
                          target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
                        }}
                      />
                    </div>

                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 border border-gray-100"
                    >
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                      />
                      <Camera className="h-5 w-5 text-indigo-600" />
                    </label>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mt-2">
                    {user?.name || "Admin User"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {user?.email || "admin@example.com"}
                  </p>

                  <div className="flex items-center justify-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrator
                  </div>

                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {user?.email || "admin@example.com"}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {user?.phoneNumber || "Not specified"}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {user?.address?.city
                        ? `${user.address.city}, ${user.address.street || ""}`
                        : "No address specified"}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Joined{" "}
                      {new Date(
                        user?.createdAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Main profile content */}
                <div className="md:w-2/3 p-6">
                  {/* Tabs for switching sections */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setSection("general")}
                      className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                        section === "general"
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      General Information
                    </button>
                    <button
                      onClick={() => setSection("password")}
                      className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                        section === "password"
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Password
                    </button>
                    <button
                      onClick={() => setSection("security")}
                      className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                        section === "security"
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Security
                    </button>
                  </div>

                  {/* General information form */}
                  {section === "general" && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                              disabled={true}
                              title="Email cannot be changed"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Email address cannot be changed
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="city"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Street Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="street"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Password change form */}
                  {section === "password" && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-5">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 6 characters
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Check className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                              Updating Password...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Security settings */}
                  {section === "security" && (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Two-factor authentication is recommended for all
                              administrator accounts.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden">
                        <div className="flex items-center justify-between py-4 border-b border-gray-200">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              Two-factor authentication
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Enable
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-gray-200">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              Login notifications
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Receive alerts when someone logs into your account
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Enable
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              Session management
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Manage your active sessions and sign out remotely
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          Recent activity
                        </h3>
                        <div className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-200">
                          <ul className="divide-y divide-gray-200">
                            {[
                              {
                                action: "Password changed",
                                date: "2 days ago",
                                ip: "192.168.1.1",
                              },
                              {
                                action: "Login successful",
                                date: "3 days ago",
                                ip: "192.168.1.1",
                              },
                              {
                                action: "Profile updated",
                                date: "1 week ago",
                                ip: "192.168.1.1",
                              },
                              {
                                action: "Login successful",
                                date: "2 weeks ago",
                                ip: "192.168.1.1",
                              },
                            ].map((activity, index) => (
                              <li key={index} className="px-4 py-3">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {activity.action}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {activity.date}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  IP: {activity.ip}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
