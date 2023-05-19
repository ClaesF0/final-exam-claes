import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required()
    .matches(/^[a-zæøå0-9_]+$/i, "Invalid symbol detected")
    .min(3, "Name must be at least 3 characters"),
  password: Yup.string()
    .required()
    .matches(/^[a-zæøå0-9]+$/i, "Invalid symbol detected")
    .min(8, "Password must be at least 8 characters"),
  email: Yup.string()
    .email()
    .matches(
      /^(?=.*[@])(?=^.*(?:(?:stud|noroff)\.no$))/,
      "Invalid email domain. Must be @stud.noroff.no or @noroff.no"
    )
    .required(),
  avatarUrl: Yup.string().url("Invalid URL"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const SignupLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      email: "",
      avatarUrl: "",
      venueManager: false,
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      if (isSignUp) {
        // Handle signup form submission
        console.log("Registering user:", values);
      } else {
        // Handle login form submission
        console.log("Logging in user:", values);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="my-2 grid grid-cols-1 gap-y-6 gap-x-8 max-w-[800px] mx-auto px-2 "
      >
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-600 underline text-sm font-semibold"
          >
            {isSignUp
              ? "Already have an account? Click here to log in to existing account"
              : "New user? Click here to sign up a new account"}
          </button>
        </div>

        <div>
          {isSignUp && (
            <>
              <p className="block text-lg text-center font-semibold leading-6 my-2 text-gray-900">
                Sign up:
              </p>

              <div className="text-start ">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.name && formik.errors.name && (
                  <span className="text-red-600 text-md">
                    Sorry, {formik.errors.name}. No special characters or spaces
                    allowed except underscore, and minimum 3 characters
                  </span>
                )}
                <div className="sm:col-span-2">
                  <label
                    for="email"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      autoComplete="email"
                      className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600 text-md">
                        Sorry, {formik.errors.email}, retry with a valid email
                        address and no special characters
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2.5">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                      password="password"
                      placeholder="Password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      id="password"
                      className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state on button click
                      className="text-primary mt-1 text-sm"
                    >
                      {showPassword ? "Hide" : "Show"} password
                    </button>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-600 text-md">
                        {formik.errors.password}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 ">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Repeat Password
                  </label>
                  <div className="mt-2.5">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Repeat password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state on button click
                      className="text-primary mt-1 text-sm"
                    >
                      {showPassword ? "Hide" : "Show"} password
                    </button>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <div className="text-red-600 text-md">
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>
                </div>

                <label
                  htmlFor="avatarUrl"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Avatar URL
                </label>
                <input
                  type="text"
                  id="avatarUrl"
                  name="avatarUrl"
                  placeholder="Publically available image URL"
                  onChange={formik.handleChange}
                  value={formik.values.avatarUrl}
                  className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.avatarUrl && formik.errors.avatarUrl && (
                  <div className="text-red-600 text-md">
                    Sorry,{formik.errors.avatarUrl}. Url must be for publically
                    accessible image and start with http:// or https://
                  </div>
                )}
                <div>
                  <label htmlFor="venueManager" className="mt-2">
                    I want to sign up as a Holidaze venue manager
                  </label>
                  <input
                    type="checkbox"
                    id="venueManager"
                    name="venueManager"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.venueManager}
                    className="mx-1 my-4"
                  />
                </div>
              </div>
            </>
          )}

          {!isSignUp && (
            <div>
              <p className="block text-lg text-center font-semibold leading-6 my-2 text-gray-900">
                Log in:
              </p>
              <div className="sm:col-span-2 ">
                <label
                  for="email"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-600 text-md">
                      Sorry, {formik.errors.email}, retry with a valid email
                      address and no special characters
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    password="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    id="password"
                    className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-primary mt-1 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"} password
                  </button>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-600 text-md">
                      {formik.errors.password}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-900/10 ">
          <button
            onClick={console.log("button clicked")}
            type="submit"
            className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isSignUp ? "Sign up" : "Log in"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SignupLoginForm;
