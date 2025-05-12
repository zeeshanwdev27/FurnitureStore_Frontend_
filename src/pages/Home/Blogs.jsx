import React from "react";

const blogs = [
    {
      image: "https://img.freepik.com/free-photo/full-shot-man-reading-couch_23-2149438581.jpg?t=st=1746125711~exp=1746129311~hmac=d0cc49f4b3e245eee79e0b583f944c0b12b6063cb83c5643692cc18472c863d6&w=996",
      category: "Livingroom",
      title: "Find Your Perfect Comfort Sofa"
    },
    {
      image: "https://img.freepik.com/free-photo/medium-shot-man-waking-up_23-2149019670.jpg?t=st=1746125679~exp=1746129279~hmac=b8ae50253a643a0a58eab72392bf361cd9590a37e94089ac9a392b2e551f1596&w=826",
      category: "Bedroom",
      title: "Sleep Better with the Right Bed"
    },
    {
      image: "https://img.freepik.com/free-vector/pest-control-service-illustration_1284-8981.jpg?t=st=1746125658~exp=1746129258~hmac=2915e692d0760f90c3f406364927ba608d7b28fced4044969feb3a9172583f91&w=740",
      category: "Furniture",
      title: "How to Keep Termites Away"
    }
  ];

  function Blogs() {
    return (
      <div className="bg-white py-10 px-4 md:px-10 lg:px-30 flex flex-col items-center justify-center">
        <p className="text-xl md:text-2xl font-bold text-center mb-8">OUR LATEST NEWS INSIGHT</p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-15 w-full">
          {blogs.map((data, key) => (
            <div
              key={key}
              className="blog-card bg-white shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:cursor-pointer"
            >
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-48 object-cover mb-2"
              />
              <div className="flex flex-col p-4 gap-1">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex gap-1 items-center">
                    <span className="material-symbols-outlined text-[#885B3A] text-base font-medium">
                      calendar_month
                    </span>
                    March 18, 2025
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="material-symbols-outlined text-[#885B3A] text-base font-medium">
                      sell
                    </span>
                    {data.category}
                  </div>
                </div>
  
                <p className="font-bold text-base md:text-lg">{data.title}</p>
  
                <div className="border border-gray-300 w-full mt-3 mb-1"></div>
  
                <a href="#" className="text-[#885B3A] flex items-center font-medium text-sm">
                  Read More
                  <span className="material-symbols-outlined text-[#885B3A] text-base">
                    arrow_right_alt
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default Blogs;
