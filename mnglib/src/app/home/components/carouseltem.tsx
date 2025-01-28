import Image from "next/image";
import React from "react";

export const CarouselItem = ({ item, isActive }) => {
  return (
    <div
      className={`relative shrink-0 w-full h-64 md:h-96 transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-0 absolute top-0 left-0"
      }`}
    >
      <Image
        src={item.url}
        className=" w-full h-full object-none rounded-xl "
        alt={item.name}
        width={500}
        height={500}
        unoptimized
        priority
      />
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
        <h3 className="text-black text-xl font-bold">{item.name}</h3>
      </div>
    </div>
  );
};
