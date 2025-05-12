import React from "react";
import Button from "@mui/material/Button";
import AllProducts from "../Product/AllProducts";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/products");
  };

  return (
    <div
      className="w-full px-10 lg:px-35 sm:h-[60vh] h-[40vh] flex items-center gap-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("https://images.unsplash.com/photo-1613906800797-d5d4fb2f7bbb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-center text-white gap-6 p-8 pl-0 rounded-lg">
        <div className="flex flex-col justify-center gap-2">
          <p className="text-lg sm:text-2xl">READY ITEM</p>
          <p className="text-2xl sm:text-5xl font-bold">HOME DECOR</p>
          <p className="sm:text-lg">From $299.00</p>
        </div>

        <div>
        <Button onClick={handleExploreClick}
  variant="outlined"
  className="!p-2 !text-xs !border-white hover:!border-white !text-black !bg-white hover:!bg-gray-50 
             lg:!text-white lg:!bg-transparent lg:hover:!text-black lg:!px-4 lg:!py-2 lg:!text-sm"
>
  EXPLORE All ITEMS
</Button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
