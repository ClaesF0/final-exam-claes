import React, { useEffect } from "react";
import { useReducer } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Search from "./Search";
import { Link } from "react-router-dom";
import { ClickAwayListener } from "@mui/base";
import {
  faBars,
  faTimes,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import moneyBagIcon from "../assets/money-bag-outline.svg";
import userIcon from "../assets/usericon.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const avatarNonNull = localStorage.getItem("avatar") !== "null";
  const userAvatar = localStorage.getItem("avatar");
  const isManager = localStorage.getItem("venueManager") == "true";
  const name = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const accessToken = localStorage.getItem("token");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <nav className="border-b-2 flex-wrap backdrop-blur-xl bg-gray-200 bg-opacity-50 border-primary border-gray-200  px-10 md:px-4 py-2.5 rounded sticky top-0 z-10 mx-auto justify-center h-24 md:h-20 md:py-2">
          <div className="inline-flex items-center justify-center px-2 pt-10% pb-2.3% mx-auto w-full h-40% ">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
            >
              <p className="ml-0 w-1/5 text-2xl font-bold text-primary">
                Holidaze
                <br />
              </p>
            </Link>

            <Search className="" />
            <div className="ml-auto flex items-center">
              {isManager ? (
                <Link to={"/makealisting"}>
                  <p className="w-1/5% text-xs font-bold lg:block whitespace-pre-wrap">
                    Your host page
                  </p>
                </Link>
              ) : (
                <Link to={"/becomevenuemanager"}>
                  <p className="w-1/5% text-xs font-bold hidden lg:block whitespace-pre-wrap">
                    Become a Holidaze host
                  </p>
                  <p className="w-1/5% text-sm font-bold flex-wrap lg:hidden">
                    Hosting
                  </p>
                </Link>
              )}

              <button className="bg-primary border-2 border-primary h-[36px] w-[40px] rounded-full mx-4 active:scale-95 transition duration-150 ease-in-out">
                <img className="h-6 w-6 mx-auto" src={moneyBagIcon} alt="" />
              </button>
            </div>

            <div className="relative bg-white border-2 border-primary rounded-full inline-flex items-center">
              <div className="flex items-center">
                <button
                  className="bg-primary border-2 border-white h-[36px] w-[40px] rounded-full active:scale-95 transition duration-150 ease-in-out text-white"
                  onClick={handleToggle}
                >
                  <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
                </button>

                <button className=" bg-primary border-2 border-white h-[36px] w-[40px] rounded-full active:scale-95 transition duration-150 ease-in-out">
                  {name ? (
                    <Link to={"/profiles/" + name}>
                      <img
                        className="h-6 w-6 mx-auto rounded-full"
                        src={
                          isLoggedIn && avatarNonNull
                            ? localStorage.getItem("avatar")
                            : userIcon
                        }
                        alt={"Your profile" + name}
                      />
                    </Link>
                  ) : (
                    <Link to="/login/">
                      <img
                        className="h-6 w-6 mx-auto rounded-full"
                        src={userIcon}
                        alt="Log in"
                      />
                    </Link>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div
            className={`w-[200px} absolute bg-white border-2 border-primary rounded-md inline-flex  right-6 top-20 ${
              isOpen ? "" : "hidden"
            }`}
          >
            <div className="">
              {!isLoggedIn && (
                <>
                  <Link to={"/signup"}>
                    <div className=" p-2 border-b border-primary hover:bg-primary hover:text-white active:bg-secondary transition duration-150 ease-in-out">
                      Sign up
                    </div>
                  </Link>
                  <Link to={"/login"}>
                    <div className=" p-2 border-b border-primary hover:bg-primary hover:text-white active:bg-secondary transition duration-150 ease-in-out">
                      Log in
                    </div>
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Link to={"/profiles/" + name}>
                    <div className=" p-2 border-b border-primary hover:bg-primary hover:text-white active:bg-secondary transition duration-150 ease-in-out">
                      Account
                    </div>
                  </Link>
                  <Link to={"/profiles/" + name}>
                    <div className=" p-2 border-b border-primary hover:bg-primary hover:text-white active:bg-secondary transition duration-150 ease-in-out">
                      Bookings
                    </div>
                  </Link>

                  {isManager ? (
                    <Link to={"/makealisting"}>
                      <div className=" p-2 border-b border-primary hover:bg-primary hover:text-white active:bg-secondary transition duration-150 ease-in-out">
                        Your host page
                      </div>
                    </Link>
                  ) : (
                    <Link to={"/becomevenuemanager"}>
                      <p className="p-2 border-b border-primary hover:bg-primary hover:text-white active:bg-secondary transition duration-150 ease-in-out">
                        Holidaze your home
                      </p>
                    </Link>
                  )}
                  <div
                    onClick={() => {
                      localStorage.clear();
                      location.replace("/");
                    }}
                    className="p-2 hover:bg-secondary hover:text-primary active:bg-red-500 active:text-white transition duration-150 ease-in-out "
                  >
                    Log out
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </ClickAwayListener>
    </>
  );
};

export default Navbar;
