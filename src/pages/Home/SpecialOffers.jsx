import React from "react";
import { useNavigate } from "react-router-dom";

function SpecialOffers() {
  const navigate = useNavigate()

  const useProductRoute =()=>{
    navigate('/products')
  }
  return (
    <div className="h-50vh flex flex-col md:flex-row justify-center items-center py-15 px-6 md:px-35 gap-6">
     
      <div className="w-full md:w-1/2 px-10 py-5 bg-gray-100 gap-15 flex flex-col rounded-md items-center lg:items-baseline">
        <div className="flex flex-col gap-3 items-center lg:items-baseline">
            <p className="text-[#885B3A] font-medium">UNIQUE OFFICE TABLE</p>
            <p className="text-3xl font-bold">30% Flat Sale</p>
            <p className="text-gray-600">Online Promo Code: <a href="#" className="font-bold text-md text-[#885B3A]">summer10</a></p>
            <button onClick={useProductRoute} className="hover:cursor-pointer w-40 px-2 py-2 bg-[#A06C47] hover:bg-[#885B3A] text-white rounded-md border border-[#885B3A]">START SHOPPING</button>
        </div>

        <div className="flex items-center gap-2">
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>53d</p></div>
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>23h</p></div>
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>39m</p></div>
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>46s</p></div>
        </div>
      </div>

      <div className="w-full md:w-1/2 px-10 py-5 bg-gray-100 gap-15 flex flex-col rounded-md items-center lg:items-baseline">
        <div className="flex flex-col gap-3 items-center lg:items-baseline">
            <p className="text-[#885B3A] font-medium">ELEGANT COMFORT CHAIR</p>
            <p className="text-3xl font-bold">10% Flat Sale</p>
            <p className="text-black">Save 20% upto $2500 order</p>
            <button onClick={useProductRoute} className=" hover:bg-gray-100 hover:cursor-pointer w-40 px-2 py-2 bg-white text-[#885B3A] border border-[#885B3A] rounded-md">START SHOPPING</button>
        </div>

        <div className="flex items-center gap-2">
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>53d</p></div>
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>23h</p></div>
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>39m</p></div>
            <div className="bg-gray-50 border border-gray-400 px-2 py-1 rounded-md"><p>46s</p></div>
        </div>
      </div>

    </div>
  );
}

export default SpecialOffers;
