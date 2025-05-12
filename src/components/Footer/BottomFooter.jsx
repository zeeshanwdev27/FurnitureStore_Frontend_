import React from 'react'
import visa from "../../assets/visa.svg";
import mastercard from "../../assets/mastercard.svg";
import maestro from "../../assets/maestro.svg";
import americanexpress from "../../assets/americanexpress.svg";
import elo from "../../assets/elo.svg";
import paypal from "../../assets/paypal.svg";

function BottomFooter() {
  return (
    <div className='px-4 md:px-10 lg:px-42'>
      <div className='bg-[#EBE7E4] px-4 md:px-15 py-4 rounded-t-lg flex flex-col md:flex-row items-center justify-between'>
        <p className='text-sm font-medium text-center md:text-left'>
          Copyright & Design By Zeeshan Khan. All Rights Reserved
        </p>
        <div className='flex gap-2 items-center justify-center mt-4 md:mt-0'>
          <div><img src={visa} alt="visa" className="w-7 h-7" /></div>
          <div><img src={mastercard} alt="mastercard" className="w-7 h-7" /></div>
          <div><img src={maestro} alt="maestro" className="w-7 h-7" /></div>
          <div><img src={americanexpress} alt="americanexpress" className="w-7 h-7" /></div>
          <div><img src={elo} alt="elo" className="w-7 h-7" /></div>
          <div><img src={paypal} alt="paypal" className="w-7 h-7" /></div>
        </div>
      </div>
    </div>
  )
}

export default BottomFooter;
