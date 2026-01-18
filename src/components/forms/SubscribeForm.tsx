"use client";
import React, { useState } from 'react';

// Extracted SVG for cleaner JSX
const MailIcon = () => (
  <div className="flex items-center justify-center w-[60px] h-[60px] bg-[#ECF1FD] dark:bg-gray-900 rounded-md shadow-[0px_0.5px_0.5px_#EFEFEF,0px_1px_0.5px_rgba(239,239,239,0.5)]">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 34" height="34" width="34">
      <path strokeLinejoin="round" strokeWidth="2.5" stroke="#115DFC" d="M7.08385 9.91666L5.3572 11.0677C4.11945 11.8929 3.50056 12.3055 3.16517 12.9347C2.82977 13.564 2.83226 14.3035 2.83722 15.7825C2.84322 17.5631 2.85976 19.3774 2.90559 21.2133C3.01431 25.569 3.06868 27.7468 4.67008 29.3482C6.27148 30.9498 8.47873 31.0049 12.8932 31.1152C15.6396 31.1838 18.3616 31.1838 21.1078 31.1152C25.5224 31.0049 27.7296 30.9498 29.331 29.3482C30.9324 27.7468 30.9868 25.569 31.0954 21.2133C31.1413 19.3774 31.1578 17.5631 31.1639 15.7825C31.1688 14.3035 31.1712 13.564 30.8359 12.9347C30.5004 12.3055 29.8816 11.8929 28.6437 11.0677L26.9171 9.91666" />
      <path strokeLinejoin="round" strokeWidth="2.5" stroke="#115DFC" d="M2.83331 14.1667L12.6268 20.0427C14.7574 21.3211 15.8227 21.9603 17 21.9603C18.1772 21.9603 19.2426 21.3211 21.3732 20.0427L31.1666 14.1667" />
      <path strokeWidth="2.5" stroke="#115DFC" d="M7.08331 17V8.50001C7.08331 5.82872 7.08331 4.49307 7.91318 3.66321C8.74304 2.83334 10.0787 2.83334 12.75 2.83334H21.25C23.9212 2.83334 25.2569 2.83334 26.0868 3.66321C26.9166 4.49307 26.9166 5.82872 26.9166 8.50001V17" />
      <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#115DFC" d="M14.1667 14.1667H19.8334M14.1667 8.5H19.8334" />
    </svg>
  </div>
);

const SubscribeForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing:', email);
    // Add your logic here
  };

  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[13px] shadow-[0px_187px_75px_rgba(0,0,0,0.01),0px_105px_63px_rgba(0,0,0,0.05),0px_47px_47px_rgba(0,0,0,0.09),0px_12px_26px_rgba(0,0,0,0.1)]">
      <form onSubmit={handleSubmit} className="flex flex-col items-start p-5 gap-5">
        
        <MailIcon />

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-bold text-[17px] leading-6 text-[#2B2B2F] dark:text-gray-100">
            Subscribe for updates
          </label>
          <span className="font-semibold text-[13px] leading-[18px] text-[#5F5D6B] dark:text-gray-400">
            Subscribe to this weekly newsletter so you don’t miss out on the new hot tech topics.
          </span>
        </div>

        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[42px] pl-3 rounded-md border border-[#e5e5e5] dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none transition-all duration-300 ease-[cubic-bezier(0.15,0.83,0.66,1)] focus:border-transparent focus:ring-1 focus:ring-[#2B2B2F] dark:focus:ring-white drop-shadow-[0px_1px_0.5px_rgba(239,239,239,0.5)] dark:drop-shadow-none"
        />

        <button
          type="submit"
          className="flex items-center justify-center w-full h-[42px] px-[18px] py-2.5 bg-gradient-to-b from-[#4480FF] via-[#115DFC] to-[#0550ED] rounded-md border-0 text-white font-semibold text-xs shadow-[0px_0.5px_0.5px_#EFEFEF,0px_1px_0.5px_rgba(239,239,239,0.5)] active:scale-[0.98] transition-transform"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubscribeForm;
