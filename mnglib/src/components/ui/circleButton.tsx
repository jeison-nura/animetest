import { Button } from "./button";
import { ComponentType } from "react";

interface CircleButtonProps {
  icon: ComponentType<{ style?: React.CSSProperties }>;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  tooltip?: string;
}

export const CircleButton = ({ 
  icon: Icon, 
  className = "", 
  onClick,
  isActive = false,
  tooltip
}: CircleButtonProps) => {
  return (
    <div className="relative group">
      <Button
        className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all duration-200 ${
          isActive 
            ? "bg-blue-600 text-white shadow-lg scale-110" 
            : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white hover:scale-105"
        } ${className}`}
        onClick={onClick}
      >
        <Icon style={{ width: "1.5rem", height: "1.5rem" }} />
      </Button>
      
      {/* Información de herramienta */}
      {tooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {tooltip}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-l-black"></div>
        </div>
      )}
    </div>
  );
};
