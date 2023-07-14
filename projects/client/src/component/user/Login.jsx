import React from "react";
import { useDispatch } from "react-redux";
import { keep } from "../../store/reducer/authSlice";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm, setStatus }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        values
      );

      if (response.status === 200) {
        const { token } = response.data;

        localStorage.setItem("token", token);
        dispatch(keep(token));
        resetForm();
        setStatus({ success: true, token });
        navigate("/home");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      setFieldError("email", "Incorrect email or password");
      setStatus({ success: false });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className="grid justify-center mt-3 bg-white rounde">
        <div className="w-screen grid grid-flow-row justify-center">
          <div>
        <img src={"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-78655edda18bc1196ab28760f1535baa_screen.jpg?ts=1617645324"} alt="Logo" className="w-60 h-60 mx-auto" />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className="relative">
                <h2 className="w-72 text-xl text-center font-Roboto text-jetblack tracking-wide font-semibold sm:text-2xl">
                  Login
                </h2>
                <p className="text-xs text-center font-Roboto mb-4 text-jetblack tracking-wide sm:text-sm">
                  Please enter your email and password:
                </p>
                <div className="grid grid-cols-1 mt-7 mb-1 pb-3">
                  <div className="font-Roboto relative">
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-redd text-xs absolute -top-5"
                    />
                    <Field
                      className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                      type="text"
                      name="email"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 mt-3">
                  <div className="font-Roboto relative">
                  <ErrorMessage name='password' component='div' className='text-redd text-xs absolute -top-5' />
                    <Field
                      className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                    />
                    <div className="absolute right-1 top-1/2 transform pt-1 -translate-y-1/2">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <AiOutlineEye size={15} />
                        ) : (
                          <AiOutlineEyeInvisible size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-2 my-4 text-xs font-Roboto tracking-wide border rounded-md bg-steel_b text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
                <div className="text-center text-xs font-Roboto tracking-wide  mb-6">
                  <p>
                    Forgot Password?
                    <button className="m-1">
                      <span className="p-1 hover:border-b-2 hover:border-darkgreen font-semibold">
                        <Link to="/signup">Create one</Link>
                      </span>
                    </button>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
