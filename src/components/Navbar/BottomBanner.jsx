import React from 'react'
import { useNavigate } from 'react-router-dom'

function BottomBanner() {
  const navigate = useNavigate()

  const handleHomeRoute = () => navigate('/')
  const handleAllProducts = () => navigate('/products')

  return (
    <div className='bg-white border-t border-gray-200 py-4 px-4 lg:px-35'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4'>
        {/* Navigation Links */}
        <nav className='w-full lg:w-auto'>
          <ul className='flex flex-wrap justify-center items-center gap-4 lg:gap-3'>
            {[
              { label: 'HOME', action: handleHomeRoute },
              { label: 'SHOP ALL', action: handleAllProducts },
              { label: 'BLOG', action: () => {} },
              { label: 'PAGES', action: () => {} },
              { label: 'CONTACT', action: () => {} }
            ].map((item, index) => (
              <li 
                key={index}
                onClick={item.action}
                className='text-sm font-semibold text-gray-800 hover:text-[#885B3A] transition-colors duration-200 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-50'
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Discount Banner */}
        <div className='w-full lg:w-auto flex justify-center items-center'>
          <div 
            className='flex items-center justify-center gap-2 cursor-pointer group'
            onClick={() => navigate('/products')}
          >
            <span className='text-sm font-semibold text-gray-800 group-hover:text-[#885B3A] transition-colors'>
              Get 30% Discount Now
            </span>
            <span className='text-xs font-bold text-white bg-[#885B3A] rounded-full px-3 py-1 transform group-hover:scale-105 transition-transform'>
              SALE
            </span>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default BottomBanner