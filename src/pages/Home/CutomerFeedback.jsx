import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Alexis D. Dowson",
    role: "Verified Furniture Buyer",
    rating: 5,
    message:
      "I bought dining set which is stunning—top-notch quality and exactly what I needed!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus L. Bennett",
    role: "Loyal Customer",
    rating: 5,
    message:
      "My custom sofa arrived on time and looks amazing in the living room. Super comfy too!",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Nathan Foster",
    role: "Returning Customer",
    rating: 5,
    message:
      "This is my third order and every piece has exceeded expectations. Great craftsmanship.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Jamie Rice",
    role: "Happy Homeowner",
    rating: 5,
    message:
      "The walnut coffee table I ordered brought my whole space together. Truly elegant.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Calvin Griffin",
    role: "Interior Design Enthusiast",
    rating: 5,
    message:
      "Beautiful chairs, excellent support team, and fast delivery. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
  },
  {
    name: "Shelly Jennings",
    role: "First-Time Buyer",
    rating: 5,
    message:
      "Ordering was easy, and the bed frame I got feels luxurious and sturdy. Love it!",
    image: "https://randomuser.me/api/portraits/women/49.jpg",
  },
  {
    name: "Vanessa Nguyen",
    role: "Verified Furniture Buyer",
    rating: 5,
    message:
      "Absolutely love the bookshelf I purchased. Solid wood, elegant finish—perfect for my office.",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
];

function CustomerFeedback() {
  return (
    <div className="bg-[#885B3A] py-10 px-4 md:px-10 lg:px-40 text-center text-white relative">
      <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-10">HAPPY CUSTOMERS</h2>

      <div className="relative px-8 lg:px-0">
        {/* Custom Navigation Arrows (Outside) */}
        <button className="custom-prev absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-2 hidden lg:flex items-center justify-center shadow-md hover:bg-gray-100 transition-all duration-200 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#885B3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="custom-next absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-2 hidden lg:flex items-center justify-center shadow-md hover:bg-gray-100 transition-all duration-200 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#885B3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
            bulletClass: 'swiper-bullet',
            bulletActiveClass: 'swiper-bullet-active'
          }}
          loop
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 24
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24
            }
          }}
        >
          {testimonials.map((testi, i) => (
            <SwiperSlide key={i} className="h-auto">
              <div className="bg-white text-black rounded-lg p-4 shadow-md h-full flex flex-col min-h-[240px]">
                <div className="flex justify-between items-center mb-2 mr-32">
                  <p className="font-semibold text-sm">Product Quality</p>
                  <div className="text-[#885B3A] text-sm">★★★★★</div>
                </div>
                <p className="text-xs text-left mb-3 line-clamp-4 flex-grow">“{testi.message}”</p>
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
                  <img
                    src={testi.image}
                    alt={testi.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold">{testi.name}</p>
                    <p className="text-[10px] text-gray-500">{testi.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="custom-pagination flex justify-center mt-6 space-x-2"></div>
      </div>
    </div>
  );
}

export default CustomerFeedback;