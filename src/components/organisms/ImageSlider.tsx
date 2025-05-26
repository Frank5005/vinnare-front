import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


interface ImageSliderProps {
  images: string[];
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, className }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative w-full h-64 md:h-96 overflow-hidden rounded-lg ${className}`} data-testid="image-slider">
      <img
        src={images[current]}
        alt={`slide-${current}`}
        className="w-full h-full object-cover transition-all duration-500"
      />
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-black bg-transparent p-0 m-0 border-none outline-none hover:scale-125 transition-transform"
        aria-label="Previous slide"
        style={{ background: 'none', border: 'none', boxShadow: 'none' }}
      >
        <FaChevronLeft strokeWidth={2} />
      </button>


      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-black bg-transparent p-0 m-0 border-none outline-none hover:scale-125 transition-transform"
        aria-label="Next slide"
        style={{ background: 'none', border: 'none', boxShadow: 'none' }}
      >
        <FaChevronRight strokeWidth={2} />
      </button>


      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            data-testid="navigation-dot"
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-black" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
