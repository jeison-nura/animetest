import React from "react";

interface MetricsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "orange" | "navy";
  trend?: string;
}

const colorClasses: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  yellow: "from-yellow-500 to-yellow-600",
  red: "from-red-500 to-red-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  navy: "from-slate-700 to-slate-800"
};

const borderColors: Record<string, string> = {
  blue: "border-blue-500/30",
  green: "border-green-500/30",
  yellow: "border-yellow-500/30",
  red: "border-red-500/30",
  purple: "border-purple-500/30",
  orange: "border-orange-500/30",
  navy: "border-slate-600/30"
};

const bgColors: Record<string, string> = {
  blue: "bg-blue-500/20",
  green: "bg-green-500/20",
  yellow: "bg-yellow-500/20",
  red: "bg-red-500/20",
  purple: "bg-purple-500/20",
  orange: "bg-orange-500/20",
  navy: "bg-slate-600/20"
};

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend
}) => {
  const colorClass = colorClasses[color] || colorClasses.blue;
  const borderColor = borderColors[color] || borderColors.blue;
  const bgColor = bgColors[color] || bgColors.blue;

  return (
    <div className={`bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl p-6 border ${borderColor} backdrop-blur-sm hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-orange-500/10 group relative overflow-hidden`}>
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-500"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-orange-400/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-red-400/40 rounded-full animate-pulse"></div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:animate-glow`}>
          <div className="text-white group-hover:animate-pulse">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 group-hover:bg-orange-500/30 transition-colors">
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-slate-300 mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-3xl font-bold text-white group-hover:text-orange-100 transition-colors group-hover:animate-pulse">{value}</p>
      </div>
      
      {/* Gradient accent line */}
      <div className={`mt-4 h-1 bg-gradient-to-r ${colorClass} rounded-full`}></div>
    </div>
  );
}; 