import Image from "next/image";
import React from "react";
import { CarouselItemProps } from "@/lib/types/components";

export const CarouselItem = ({ item, isActive }: CarouselItemProps) => {
  return (
    <div
      className={`relative shrink-0 w-full h-64 md:h-96 transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-0 absolute top-0 left-0"
      }`}
    >
      <div className="bg-[#a3b4a2] rounded-xl w-full h-full relative overflow-hidden scrollbar-hide">
        <Image
          src={item.url}
          className="w-full h-full object-cover"
          alt={item.name}
          width={500}
          height={500}
          unoptimized
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start">
          <h2 className="text-black text-5xl font-bold mb-4">
            {item.name.toUpperCase()}
          </h2>
          <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-black/80 transition-colors">
            WATCH NOW
          </button>
        </div>
      </div>
    </div>
  );
};
