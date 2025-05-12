import React from 'react'
import roiserLogo from "../../assets/ROISER.png";

function MainFooter() {
  return (
    <div className='px-4 md:px-10 lg:px-42 py-10 flex flex-col lg:flex-row gap-10 lg:gap-0 justify-between'>

      {/* Info */}
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <div className="brand-name flex items-center gap-2">
            <img
              className="w-10 h-10 object-contain"
              src={roiserLogo}
              alt="roiserlogo"
            />
            <p className="text-xl font-bold text-gray-800">ROISER</p>
          </div>
          <div className='text-gray-600 max-w-xs text-sm'>
            Roiser is a furniture store offering durable, well-crafted pieces designed to elevate modern living spaces.
          </div>
        </div>

        <div className='Phone-Detail flex items-center gap-3'>
          <div className='bg-white rounded-full px-3 py-3 flex items-center justify-center'>
            <span className="material-symbols-outlined text-[#885B3A] !font-bold">phone_in_talk</span>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm text-gray-600'>Have Question? Call Us 24/7</p>
            <p className='text-xl font-bold text-[#885B3A]'>+258 3692 2569</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className='flex flex-col gap-6'>
        <p className='font-medium text-lg'>Quick Links</p>
        <ul className='flex flex-col gap-2'>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="material-symbols-outlined text-gray-600 !font-thin">arrow_right_alt</span> Our Story
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="material-symbols-outlined text-gray-600 !font-thin">arrow_right_alt</span> Our Materials
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="material-symbols-outlined text-gray-600 !font-thin">arrow_right_alt</span> Sustainability
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="material-symbols-outlined text-gray-600 !font-thin">arrow_right_alt</span> Careers
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="material-symbols-outlined text-gray-600 !font-thin">arrow_right_alt</span> Sitemap
            </a>
          </li>
        </ul>
      </div>

      {/* Information */}
      <div className='flex flex-col gap-6'>
        <p className='font-medium text-lg'>Information</p>
        <ul className='flex flex-col gap-2'>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="!font-thin material-symbols-outlined text-gray-600">arrow_right_alt</span> Custom Service
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="!font-thin material-symbols-outlined text-gray-600">arrow_right_alt</span> Ordering Tracking
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="!font-thin material-symbols-outlined text-gray-600">arrow_right_alt</span> Contacts
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="!font-thin material-symbols-outlined text-gray-600">arrow_right_alt</span> Events
            </a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-1 text-sm'>
              <span className="!font-thin material-symbols-outlined text-gray-600">arrow_right_alt</span> About Us
            </a>
          </li>
        </ul>
      </div>

      {/* Social Links */}
      <div className='flex flex-col gap-6'>
        <p className='font-medium text-lg'>Social Links</p>
        <ul className='flex flex-col gap-3 justify-center'>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-2 text-sm'><i className="fa-brands fa-facebook"></i> Facebook</a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-2 text-sm'><i className="fa-brands fa-dribbble"></i> Dribble</a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-2 text-sm'><i className="fa-brands fa-x-twitter"></i> Twitter</a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-2 text-sm'><i className="fa-brands fa-behance"></i> Behance</a>
          </li>
          <li className='text-gray-600'>
            <a href="#" className='flex items-center gap-2 text-sm'><i className="fa-brands fa-youtube"></i> Youtube</a>
          </li>
        </ul>
      </div>

      {/* Get Newsletter */}
      <div className='flex flex-col gap-4 md:gap-2 sm:gap-1'>
        <div className='flex flex-col gap-6'>
          <p className='font-medium text-lg'>Get Newsletter</p>
          <p className='text-gray-600 text-sm'>Get 10% off your first order! Hurry up</p>
        </div>
        <div className='flex flex-col gap-3 items-start'>
          <input className="border border-gray-400 bg-white rounded-md p-1 px-2 w-full" type="text" placeholder='Enter Email Address' />
          <button className='bg-[#885B3A] text-white font-medium px-5 py-1 rounded-md'>Subscribe</button>
        </div>
      </div>

    </div>
  )
}

export default MainFooter;
