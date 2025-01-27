"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CarouselItem } from "./carouseltem";
import { Button } from "@/components/ui/button";

export default function Carousel({ data }) {
  const { items = {}, interval = 3000 } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index: number) => {
          console.log(item);
          return (
            <CarouselItem
              item={item}
              key={item.id}
              isActive={index === activeIndex}
            />
          );
        })}
      </div>
      <Button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={prevSlide}
        aria-label="Previous slide"
        variant="ghost"
      >
        <ChevronLeftIcon style={{ width: "1.5rem", height: "1.5rem" }} />
      </Button>
      <Button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={nextSlide}
        aria-label="Next slide"
        variant="ghost"
      >
        <ChevronRightIcon style={{ width: "1.5rem", height: "1.5rem" }} />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_: never, index: number) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              index === activeIndex ? "bg-black" : "bg-white bg-opacity-50"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
