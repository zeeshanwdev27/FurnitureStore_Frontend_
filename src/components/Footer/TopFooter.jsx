import React from 'react';

function TopFooter() {
  return (
    <div className='px-4 md:px-10 lg:px-42 pt-10'>
      <div className='bg-white flex flex-col md:flex-row justify-between items-start md:items-center rounded-md divide-y md:divide-y-0 md:divide-x divide-gray-200'>

        {/* Block 1 */}
        <div className='py-4 px-6 w-full md:w-auto'>
          <div className='flex gap-3 items-center'>
            <span className="material-symbols-outlined !font-thin !text-4xl">package_2</span>
            <div>
              <p className='font-bold text-sm'>Free Shipping</p>
              <p className='text-xs text-gray-600'>Free Shipping</p>
            </div>
          </div>
        </div>

        {/* Block 2 */}
        <div className='py-4 px-6 w-full md:w-auto'>
          <div className='flex gap-3 items-center'>
            <span className="material-symbols-outlined !font-thin !text-4xl">delivery_truck_speed</span>
            <div>
              <p className='font-bold text-sm'>Free Returns</p>
              <p className='text-xs text-gray-600'>30 days free return policy</p>
            </div>
          </div>
        </div>

        {/* Block 3 */}
        <div className='py-4 px-6 w-full md:w-auto'>
          <div className='flex gap-3 items-center'>
            <span className="material-symbols-outlined !font-thin !text-4xl">credit_score</span>
            <div>
              <p className='font-bold text-sm'>Secured Payments</p>
              <p className='text-xs text-gray-600'>We accept all major credit cards</p>
            </div>
          </div>
        </div>

        {/* Block 4 */}
        <div className='py-4 px-6 w-full md:w-auto'>
          <div className='flex gap-3 items-center'>
            <span className="material-symbols-outlined !font-thin !text-4xl">support_agent</span>
            <div>
              <p className='font-bold text-sm'>Customer Service</p>
              <p className='text-xs text-gray-600'>Top notch customer service</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TopFooter;
