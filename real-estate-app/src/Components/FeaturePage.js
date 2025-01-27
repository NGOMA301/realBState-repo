import React from 'react';
import rent11 from '../Assets/rent11.png'
import rent22 from '../Assets/rent22.png'

const FeaturePage = () => {
  const features = [
    {
      title: "Wide Range of Properties",
      description: "Browse through our extensive collection of properties, from cozy apartments to luxury homes.",
      icon: (
        <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
          <path d="M3 9h18" strokeWidth="2"/>
          <path d="M9 21V9" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Trusted by thousands",
      description: "Join our community of satisfied customers who have found their perfect property through us.",
      icon: (
        <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="8" r="5" strokeWidth="2"/>
          <path d="M20 21c0-4.418-3.582-8-8-8s-8 3.582-8 8" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Financing made easy",
      description: "Get help with financing options and make your dream property purchase a reality.",
      icon: (
        <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M15 9.354a4 4 0 1 0 0 5.292" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "We are here near you",
      description: "Find local support and expertise wherever you are, with our widespread network of agents.",
      icon: (
        <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2"/>
          <circle cx="12" cy="9" r="3" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="px-4 py-16 bg-gray-50 text-center">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="space-y-4">
            <img 
              src={rent22}
              alt="Modern house exterior" 
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
            <img 
              src={rent11}
              alt="Modern house with garden" 
              className="w-full h-auto rounded-lg shadow-lg object-cover ml-auto lg:w-5/6"
            />
          </div>

          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl text-center font-bold text-gray-900">
                Welcome to <span className="text-red-500">@company name</span>, With all conveniences.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="space-y-4">
                  <div className="inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;