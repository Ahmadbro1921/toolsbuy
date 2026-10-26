"use client";

import { useState } from "react";
import Link from "next/link";

export function PricingPlansSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-manrope text-4xl sm:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
            Choose your plan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center leading-6 mb-9 text-base sm:text-lg">
            7 Days free trial. No credit card required.
          </p>

          {/* Switch */}
          <div className="flex justify-center items-center select-none">
            <label
              htmlFor="basic-with-description"
              className={`min-w-[3.5rem] text-lg sm:text-xl relative mr-4 font-medium cursor-pointer transition-colors ${
                !isYearly ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"
              }`}
            >
              Bill Monthly
            </label>

            <input
              type="checkbox"
              id="basic-with-description"
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
              className="relative shrink-0 w-11 h-6 p-0.5 bg-indigo-100 dark:bg-indigo-950 checked:bg-none checked:bg-indigo-100 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:border-blue-600 appearance-none before:inline-block before:w-5 before:h-5 before:bg-indigo-600 checked:before:bg-indigo-600 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200"
            />

            <label
              htmlFor="basic-with-description"
              className={`relative min-w-[3.5rem] font-medium text-lg sm:text-xl ml-4 cursor-pointer transition-colors flex items-center gap-2 ${
                isYearly ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"
              }`}
            >
              <span>Bill Yearly</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                Save 20%
              </span>
            </label>
          </div>
          {/* Switch End */}
        </div>

        {/* Grid */}
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0 lg:items-center">
          {/* 1. Free Plan */}
          <div className="flex flex-col mx-auto max-w-sm w-full text-gray-900 dark:text-white rounded-2xl bg-gray-50 dark:bg-card border border-border/80 p-6 xl:py-9 xl:px-12 transition-all duration-500 hover:bg-gray-100 dark:hover:bg-accent/40 shadow-sm hover:shadow-lg">
            <h3 className="font-manrope text-2xl font-bold mb-3">Free</h3>
            <div className="flex items-center mb-6">
              <span className="font-manrope mr-2 text-6xl font-semibold">$0</span>
              <span className="text-xl text-gray-500">/ month</span>
            </div>

            {/* List */}
            <ul className="mb-12 space-y-6 text-left text-lg text-gray-500 dark:text-gray-400">
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>2 auto tracking</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>7 Day transaction clearing</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>24/7 Customer support</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>All widget access</span>
              </li>
            </ul>

            <Link
              href="/order/checkout?package=basic"
              className="py-2.5 px-5 bg-indigo-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit mx-auto hover:bg-indigo-700 block"
            >
              Purchase Plan
            </Link>
          </div>

          {/* 2. Advanced Plan (Most Popular) */}
          <div className="flex flex-col mx-auto max-w-sm w-full text-gray-900 dark:text-white rounded-2xl bg-indigo-50 dark:bg-card border-2 border-indigo-500 transition-all duration-500 hover:bg-indigo-100 dark:hover:bg-accent/40 shadow-xl overflow-hidden scale-[1.02] z-10">
            <div className="uppercase bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-2xl p-3 text-center text-white text-xs font-black tracking-widest shadow">
              MOST POPULAR
            </div>
            <div className="p-6 xl:py-9 xl:px-12">
              <h3 className="font-manrope text-2xl font-bold mb-3">Advanced</h3>
              <div className="flex items-center mb-6">
                <span className="font-manrope mr-2 text-6xl font-semibold text-indigo-600 dark:text-indigo-400">
                  ${isYearly ? "120" : "150"}
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400">/ month</span>
              </div>

              {/* List */}
              <ul className="mb-12 space-y-6 text-left text-lg text-gray-700 dark:text-gray-300">
                <li className="flex items-center space-x-4">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-indigo-600"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>AI Advisor</span>
                </li>
                <li className="flex items-center space-x-4">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-indigo-600"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Unlimited auto tracking</span>
                </li>
                <li className="flex items-center space-x-4">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-indigo-600"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>1 Day transaction clearing</span>
                </li>
                <li className="flex items-center space-x-4">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-indigo-600"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center space-x-4">
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-indigo-600"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>All Widget Access</span>
                </li>
              </ul>

              <Link
                href="/order/checkout?package=standard"
                className="py-2.5 px-5 bg-indigo-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-indigo-700"
              >
                Purchase Plan
              </Link>
            </div>
          </div>

          {/* 3. Team Plan */}
          <div className="flex flex-col mx-auto max-w-sm w-full text-gray-900 dark:text-white rounded-2xl bg-gray-50 dark:bg-card border border-border/80 p-6 xl:py-9 xl:px-12 transition-all duration-500 hover:bg-gray-100 dark:hover:bg-accent/40 shadow-sm hover:shadow-lg">
            <h3 className="font-manrope text-2xl font-bold mb-3">Team</h3>
            <div className="flex items-center mb-6">
              <span className="font-manrope mr-2 text-6xl font-semibold">
                ${isYearly ? "145" : "180"}
              </span>
              <span className="text-xl text-gray-500 dark:text-gray-400">/ month</span>
            </div>

            {/* List */}
            <ul className="mb-12 space-y-6 text-left text-lg text-gray-500 dark:text-gray-400">
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>AI Advisor</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Unlimited auto tracking</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>1 Day transaction clearing</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center space-x-4">
                <svg
                  className="flex-shrink-0 w-6 h-6 text-indigo-600"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>All Widget Access</span>
              </li>
            </ul>

            <Link
              href="/order/checkout?package=premium"
              className="py-2.5 px-5 bg-indigo-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit mx-auto hover:bg-indigo-700 block"
            >
              Purchase Plan
            </Link>
          </div>
        </div>
        {/* Grid End */}
      </div>
    </section>
  );
}
