"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeAction } from "@/app/actions/newsletter";

// ---------------------------------------------------------------------------
// Mail icon (inline SVG for zero-dependency)
// ---------------------------------------------------------------------------
const MailIcon = () => (
  <div className="flex items-center justify-center w-[60px] h-[60px] bg-emerald-50 dark:bg-emerald-950/40 rounded-md shadow-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 34 34"
      height="34"
      width="34"
      className="text-emerald-600 dark:text-emerald-400"
    >
      <path
        strokeLinejoin="round"
        strokeWidth="2.5"
        stroke="currentColor"
        d="M7.08385 9.91666L5.3572 11.0677C4.11945 11.8929 3.50056 12.3055 3.16517 12.9347C2.82977 13.564 2.83226 14.3035 2.83722 15.7825C2.84322 17.5631 2.85976 19.3774 2.90559 21.2133C3.01431 25.569 3.06868 27.7468 4.67008 29.3482C6.27148 30.9498 8.47873 31.0049 12.8932 31.1152C15.6396 31.1838 18.3616 31.1838 21.1078 31.1152C25.5224 31.0049 27.7296 30.9498 29.331 29.3482C30.9324 27.7468 30.9868 25.569 31.0954 21.2133C31.1413 19.3774 31.1578 17.5631 31.1639 15.7825C31.1688 14.3035 31.1712 13.564 30.8359 12.9347C30.5004 12.3055 29.8816 11.8929 28.6437 11.0677L26.9171 9.91666"
      />
      <path
        strokeLinejoin="round"
        strokeWidth="2.5"
        stroke="currentColor"
        d="M2.83331 14.1667L12.6268 20.0427C14.7574 21.3211 15.8227 21.9603 17 21.9603C18.1772 21.9603 19.2426 21.3211 21.3732 20.0427L31.1666 14.1667"
      />
      <path
        strokeWidth="2.5"
        stroke="currentColor"
        d="M7.08331 17V8.50001C7.08331 5.82872 7.08331 4.49307 7.91318 3.66321C8.74304 2.83334 10.0787 2.83334 12.75 2.83334H21.25C23.9212 2.83334 25.2569 2.83334 26.0868 3.66321C26.9166 4.49307 26.9166 5.82872 26.9166 8.50001V17"
      />
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        stroke="currentColor"
        d="M14.1667 14.1667H19.8334M14.1667 8.5H19.8334"
      />
    </svg>
  </div>
);

// ---------------------------------------------------------------------------
// Submit button – reads pending state from the nearest <form>
// ---------------------------------------------------------------------------
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="
        flex items-center justify-center w-full h-[42px] px-[18px] py-2.5
        bg-gradient-to-b from-emerald-500 to-teal-800
        hover:from-emerald-600 hover:to-teal-900
        rounded-md border-0 text-white font-semibold text-xs
        shadow-md shadow-emerald-500/10 dark:shadow-none
        active:scale-[0.98] transition-all duration-150
        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
      "
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Subscribing…
        </span>
      ) : (
        "Subscribe"
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const SubscribeForm = () => {
  const [state, formAction] = useActionState(subscribeAction, null);

  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-[#040d0a] border border-slate-200/80 dark:border-[#0d2a22] rounded-2xl shadow-xl dark:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all duration-300">
      <form action={formAction} className="flex flex-col items-start p-5 gap-5">
        <MailIcon />

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="subscribe-email"
            className="font-bold text-[17px] leading-6 text-slate-800 dark:text-emerald-50"
          >
            Subscribe for updates
          </label>
          <span className="font-semibold text-[13px] leading-[18px] text-slate-500 dark:text-emerald-100/70">
            Subscribe to this weekly newsletter so you don&apos;t miss out on
            the new hot tech topics.
          </span>
        </div>

        {/* Full name (optional) */}
        <input
          name="fullName"
          type="text"
          placeholder="Full name (optional)"
          className="
            w-full h-[42px] pl-3 rounded-md
            border border-slate-200 dark:border-[#0d2a22]
            bg-white dark:bg-emerald-950/20 dark:text-emerald-50
            outline-none text-sm
            transition-all duration-300 ease-[cubic-bezier(0.15,0.83,0.66,1)]
            focus:border-transparent focus:ring-1 focus:ring-emerald-500
          "
        />

        {/* Email */}
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          placeholder="Enter your e-mail"
          className="
            w-full h-[42px] pl-3 rounded-md
            border border-slate-200 dark:border-[#0d2a22]
            bg-white dark:bg-emerald-950/20 dark:text-emerald-50
            outline-none text-sm
            transition-all duration-300 ease-[cubic-bezier(0.15,0.83,0.66,1)]
            focus:border-transparent focus:ring-1 focus:ring-emerald-500
            drop-shadow-[0px_1px_0.5px_rgba(239,239,239,0.5)]
          "
        />

        <SubmitButton />

        {/* Feedback messages */}
        {state?.error && (
          <p className="w-full text-red-500 text-[12px] font-medium">
            ⚠️ {state.error}
          </p>
        )}
        {state?.success && (
          <p className="w-full text-green-600 dark:text-green-400 text-[12px] font-medium">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default SubscribeForm;
