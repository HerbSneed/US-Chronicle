import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../utils/categories";
import { REGISTER_USER } from "../utils/mutations";
import { useCurrentUserContext } from "../context/CurrentUser";

const RegistrationForm = () => {
  const { loginUser } = useCurrentUserContext();
  const navigate = useNavigate();

  // State to manage form input values and errors
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userDefaultNews: "Select a category",
  });
  const [errors, setErrors] = useState({});

  // Mutation hook for registration
  const [register] = useMutation(REGISTER_USER);

  // Function to handle registration response
  const handleRegistrationResponse = (
    alreadyRegistered,
    currentUser,
    token,
    error
  ) => {
    if (alreadyRegistered) {
      alert("User is already registered. Please login.");
      navigate("/login");
    } else if (currentUser && token) {
      loginUser(currentUser, token);
      navigate("/");
    }
    if (error) {
      console.log(error.message);
    }
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validation for required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "userDefaultNews",
    ];
    const fieldErrors = {};

    requiredFields.forEach((field) => {
      if (!formState[field]) {
        fieldErrors[field] = `${field} is required`;
      }
    });

    setErrors(fieldErrors);

    // If there are errors, return without submitting
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    try {
      // Prepare variables for registration mutation
      let variables = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        password: formState.password,
        userDefaultNews: formState.userDefaultNews,
      };

      // If the default news category is not selected, alert the user
      if (formState.userDefaultNews === "Select a category") {
        variables.selectedCategory = formState.selectedCategory;
        alert("Please select a default news category");
      }

      // Perform registration mutation
      const mutationResponse = await register({
        variables: variables,
      });

      // Extract data from mutation response
      const { token, currentUser, alreadyRegistered } =
        mutationResponse.data.register;

      // Handle registration response
      handleRegistrationResponse(alreadyRegistered, currentUser, token);
    } catch (error) {
      // Handle registration errors
      if (error.message.includes("E11000 duplicate key error collection")) {
        handleRegistrationResponse(true, null, null, error);
      } else {
        handleRegistrationResponse(false, null, null, error);
      }
    }
  };

  return (
    <>
      <form
        id="registration-form"
        onSubmit={handleFormSubmit}
        className="px-6 pt-2 mx-4 h-screen my-3 mx-auto sm:w-3/5 md:w-2/4 lg:w-2/5 xl:w-2/6 2xl:w-2/6"
      >
        <div className="text-left">
          <h1 className="text-[36px] -mb-3 font-bold font-[Newsreader]">
            Register
          </h1>
          <h2 className="text-[28px] font-[Newsreader]">for a new account</h2>
        </div>

        <label htmlFor="firstName" className="block mb-2 mt-1 font-semibold">
          First name:
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            className={`mt-1 p-2 mb-2 w-full border rounded ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName}</p>
          )}
        </label>
        <label htmlFor="lastName" className="block mb-2 font-semibold">
          Last name:
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </label>
        <label htmlFor="email" className="font-semibold block mb-2">
          Email:
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </label>
        <label htmlFor="password" className="block mb-2 font-semibold">
          Password:
          <input
            placeholder="******"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </label>

        <label
          htmlFor="userDefaultNews"
          className=" relative mb-2 font-semibold"
        >
          Default Category:
          <select
            name="userDefaultNews"
            value={formState.userDefaultNews}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded appearance-none"
          >
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-newsBlue text-white p-2 rounded hover:bg-blue-600 mt-4 w-full mb-2"
        >
          Sign Up
        </button>
        <p className="font-bold text-right">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default RegistrationForm;
