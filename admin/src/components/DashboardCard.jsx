import React from "react";

const DashboardCard = ({ title, value, icon, trend, color = "bg-white" }) => {
  return (
    <div
      className={`${color} rounded-lg shadow-sm p-6 transition-transform hover:shadow-md hover:scale-[1.01] duration-200`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>

          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>

        <div className="p-2 rounded-md bg-gray-100">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
