import React from "react";
import { useReducer } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded sticky top-0">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <div className="flex md:order-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              data-collapse-toggle="navbar-search"
              classNameName="absolute md:hidden right-0 top-0 mt-4 mr-4"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-search"
              aria-expanded="false"
            >
              <div
                className={` md:flex md:w-full md:justify-between md:order-1 ${
                  isOpen ? "hidden" : "relative"
                } `}
                data-te-dropdown-ref
              >
                <span
                  className={`absolute -mt-2.5 ml-2 rounded-full bg-red-700 py-0 px-1.5 text-xs text-white `}
                >
                  {2}
                </span>
              </div>
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.293 13.293a1 1 0 0 1-1.414 0L10 11.414l-1.879 1.879a1 1 0 1 1-1.414-1.414L8.586 10 6.707 8.121a1 1 0 0 1 1.414-1.414L10 8.586l1.879-1.879a1 1 0 0 1 1.414 1.414L11.414 10l1.879 1.879a1 1 0 0 1 0 1.414z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 9a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM3 14a1 1 0 1 1 0-2h12a1 1 0 1 1 0 2H3z"
                  />
                )}
              </svg>
            </button>
          </div>

          <div
            className={` md:flex md:w-full md:justify-between md:order-1 ${
              isOpen ? "justify-between w-full" : "hidden"
            } `}
            id="navbar-search"
          >
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Home
            </span>

            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white ">
              <div className="relative flex items-center ">
                <span className="[&>svg]:w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                  </svg>
                </span>

                <div className="relative" data-te-dropdown-ref>
                  <span className="absolute -mt-2.5 ml-2 rounded-full bg-red-700 py-0 px-1.5 text-xs text-white">
                    {1}
                  </span>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
