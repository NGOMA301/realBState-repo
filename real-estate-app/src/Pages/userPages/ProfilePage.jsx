import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Camera, Check, Lock, Save, User, MapPin, Phone } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";




const UpdateProfile = () => {
  const { user, updateUser } = useAuth();
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
  const [section, setSection] = useState("general"); // "general" or "password"
  const [loadingImage, setLoadingImage] = useState(false);
  const API_URL = "http://localhost:5000";

  useEffect(() => {
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
  }, [user]);

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
        
        // Show temporary success message for image selection
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
    if (section === "password" && formData.currentPassword && formData.newPassword) {
      formDataToSend.append("currentPassword", formData.currentPassword);
      formDataToSend.append("newPassword", formData.newPassword);
    }
    
    // Add profile image if selected
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      // Simulate API call for demonstration
      // In real implementation, uncomment the fetch call below
      
       
      const response = await fetch(`${API_URL}/api/edit/profile`, {
        method: "PUT",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }


      updateUser(data.user);
      
      
      // Simulate successful API call
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
        
        updateUser(mockUpdatedUser);
        
        // Clear password fields after submission
        if (section === "password") {
          setFormData(prev => ({
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
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="space-y-6">
        <div className="profile-section" style={{ animationDelay: "0ms" }}>
          <div className="apple-chip mb-2">Profile</div>
          <h1 className="text-3xl font-medium mb-2">Personal Information</h1>
          <p className="text-gray-500 mb-6">Update your profile details and preferences</p>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile image section */}
            <div className="md:w-1/3 apple-card p-6 flex flex-col items-center justify-center hover-scale">
              <div className="relative group mb-4">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg transition-all duration-300 ${loadingImage ? 'animate-pulse-soft' : ''}`}>
                  <img
                    src={previewImage || "/default-avatar.jpeg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target;
                      target.src = "/default-avatar.jpeg";
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
                  <Camera className="h-5 w-5 text-apple-blue" />
                </label>
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-lg">{user?.name}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>
            
            {/* Tabs for switching sections */}
            <div className="md:w-2/3 space-y-5">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setSection("general")}
                  className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                    section === "general" 
                      ? "text-apple-blue border-b-2 border-apple-blue" 
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  General Information
                </button>
                <button
                  onClick={() => setSection("password")}
                  className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                    section === "password" 
                      ? "text-apple-blue border-b-2 border-apple-blue" 
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Password
                </button>
              </div>
            
              {/* General information form */}
              {section === "general" && (
                <form onSubmit={handleSubmit} className="space-y-5 profile-section" style={{ animationDelay: "100ms" }}>
                  <div className="input-group">
                    <label htmlFor="name" className="apple-label flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="apple-input"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="phoneNumber" className="apple-label flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="apple-input"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-group">
                      <label htmlFor="city" className="apple-label flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="apple-input"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="street" className="apple-label flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Street
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="apple-input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="apple-button flex items-center justify-center gap-2 mt-8"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
              )}
              
              {/* Password change form */}
              {section === "password" && (
                <form onSubmit={handleSubmit} className="space-y-5 profile-section" style={{ animationDelay: "100ms" }}>
                  <div className="input-group">
                    <label htmlFor="currentPassword" className="apple-label flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" /> Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="apple-input"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="newPassword" className="apple-label flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" /> New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="apple-input"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="confirmPassword" className="apple-label flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="apple-input"
                      disabled={loading}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="apple-button flex items-center justify-center gap-2 mt-8"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;