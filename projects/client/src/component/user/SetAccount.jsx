import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SetPassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/auth/profile?token=${token}`
        );
        setUser(res.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { password, confirm_password, full_name, birth_date } = values;
    if (password !== confirm_password) {
      alert("Password and Confirm Password does not match");
      setSubmitting(false);
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/auth/set-pass?token=${token}`,
        { password, full_name, birth_date }
      );
      alert("Changes saved successfully!");
      resetForm();
      navigate("/");
    } catch (error) {
      alert("An error occurred.");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("Password is required"),
    confirm_password: Yup.string().required("Confirm Password is required"),
    full_name: Yup.string(),
    birth_date: Yup.date(),
  });

  const initialValues = {
    password: "",
    confirm_password: "",
    full_name: "",
    birth_date: "",
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white rounde">
      <div className="w-screen grid grid-flow-row justify-center">
        <div>
          <img
            src={
              "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-78655edda18bc1196ab28760f1535baa_screen.jpg?ts=1617645324"
            }
            alt="Logo"
            className="w-60 h-60 mx-auto"
          />
        </div>
        <div>
          {user && (
            <div>
              <p className="text-center mt-4">Full Name: {user.full_name}</p>
              <p className="text-center">
                Birth Date:{" "}
                {new Date(user.birth_date).toISOString().split("T")[0]}
              </p>
            </div>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status, values }) => (
              <Form className="relative justify-center">
                <div className="grid justify-center items-center">
                  <h2 className="w-72 text-xl text-center font-Roboto text-jetblack tracking-wide font-semibold sm:text-2xl">
                    Set Your Account
                  </h2>
                </div>
                <p className="text-xs text-center font-Roboto mb-4 text-jetblack tracking-wide sm:text-sm">
                  Please enter your password and other optional details:
                </p>
                <div className="grid grid-cols-1 mt-7 mb-1 pb-3">
                  <div className="font-Roboto relative">
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-redd text-xs absolute -top-5"
                    />
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
                  <div className="font-Roboto relative mt-6">
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      className="text-redd text-xs absolute -top-5"
                    />
                    <Field
                      className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                      type="password"
                      name="confirm_password"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className="font-Roboto relative mt-4">
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="text-redd text-xs absolute -top-5"
                    />
                    <Field
                      className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                      type="text"
                      name="full_name"
                      placeholder="Full Name (optional)"
                    />
                  </div>
                  <div className="font-Roboto relative mt-4">
                    <ErrorMessage
                      name="birth_date"
                      component="div"
                      className="text-redd text-xs absolute -top-5"
                    />
                    <Field
                      className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                      type="date"
                      name="birth_date"
                      placeholder="Birth Date (optional)"
                    />
                  </div>
                  <div className="text-center mt-8">
                    <button
                      className="w-full py-2 my-4 text-xs font-Roboto tracking-wide border rounded-md bg-steel_b text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
