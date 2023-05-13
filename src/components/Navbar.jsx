import React from "react";
import { useReducer } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="border-b-2 flex-wrap backdrop-blur-xl bg-gray-200 bg-opacity-50 border-primary border-gray-200  px-10 md:px-4 py-2.5 rounded sticky top-0 z-10 mx-auto justify-center h-28 md:py-6">
        <div class="inline-flex items-center justify-center px-2 pt-10% pb-2.3% mx-auto w-full h-40% ">
          <p class="ml-0 w-1/5 h-1.6% text-2xl font-bold text-primary">
            Holidaze
            <br />
          </p>
          <div class=" inline-flex items-center mx-auto fixed bottom-2 left-1/2 transform -translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
            <input
              type="text"
              placeholder=""
              class="bg-white border-2 border-primary shadow rounded-full w-[340px] lg:w-[440px] h-[48px] px-4 flex-grow"
            />
            <button class="absolute right-0  bg-primary border-2 border-white h-[40px] w-[40px] rounded-full mx-4 active:scale-95 transition duration-150 ease-in-out">
              <img
                class="h-6 w-6 mx-auto"
                src=" src/assets/search.svg "
                alt="Search"
              />
            </button>
          </div>
          <span className="ml-auto flex items-center">
            <p class="w-1/5% text-sm font-bold hidden lg:block">
              Become a Holidaze host
            </p>
            <p class="w-1/5% text-sm font-bold flex-wrap lg:hidden">Hosting</p>

            <button class="bg-primary border-2 border-primary h-[40px] w-[40px] rounded-full mx-4 active:scale-95 transition duration-150 ease-in-out">
              <img
                class="h-6 w-6 mx-auto"
                src="src/assets/money-bag-outline.svg"
                alt=""
              />
            </button>
          </span>

          <div class="relative bg-white border-2 border-primary rounded-full inline-flex items-center">
            <div class="flex items-center">
              <button
                className="bg-primary border-2 border-white h-[40px] w-[40px] rounded-full active:scale-95 transition duration-150 ease-in-out text-white h-6 w-6"
                onClick={handleToggle}
              >
                <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
              </button>
              <button class=" bg-primary border-2 border-white h-[40px] w-[40px] rounded-full mx-1 active:scale-95 transition duration-150 ease-in-out">
                <img
                  class="h-6 w-6 mx-auto"
                  src=" src/assets/usericon.svg "
                  alt="Search"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
