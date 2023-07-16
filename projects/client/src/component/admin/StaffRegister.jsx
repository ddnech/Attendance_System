import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StaffRegistrationForm = () => {
  const token = useSelector((state) => state.auth.token);
  const initialValues = {
    email: '',
    full_name: '',
    birth_date: '',
    join_date: '',
    salary: '',
  };
  const [isRegistered, setIsRegistered] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Please use a valid email format').required('Email is required'),
    full_name: Yup.string().required("Full Name is required"),
    birth_date: Yup.date().max(new Date(), "Birth date can't be in the future").required("Birth date is required"),
    join_date: Yup.date().max(new Date(), "Join date can't be in the future").required("Join date is required"),
    salary: Yup.number("Enter number format").required('Salary is required'),
  });

  const onSubmit = async (values, { setStatus, setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/register',
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsRegistered(true);
      setTimeout(() => setIsRegistered(false), 2000);
      resetForm();
    } catch (error) {
      const response = error.response;
      if (response.status === 400) {
        const errors = response.data.errors || [];
        const emailError = errors.find(err => err.path === "email");
        if (emailError) {
          setStatus({ success: false, message: emailError.msg });
          setTimeout(() => setStatus({}), 3000);
        } else {
          setStatus({ success: false, message: "An error occurred" });
        }
      } else if (response.status === 500) {
        setStatus({ success: false, message: "Internal Server Error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex  justify-center h-screen bg-white rounded'>
      <div className='w-fit grid grid-flow-row justify-center mt-20'>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, status }) => (
              <Form className="relative justify-center">
                <div className='grid justify-center items-center'>
                  <h2 className="w-72 text-xl text-center font-Roboto text-jetblack tracking-wide font-semibold sm:text-2xl">
                    Register New Staff
                  </h2>
                </div>
                {isRegistered && (
                  <p className="text-xs text-center font-Roboto mb-4 text-greenn tracking-wide sm:text-sm text-green-500">
                    Staff registered successfully!
                  </p>
                )}
                <p className="text-xs text-center font-Roboto mb-4 text-jetblack tracking-wide sm:text-sm">
                  Please enter staff details:
                </p>
                {status && !status.success && <div className='text-redd text-xs '>{status.message}</div>}
                <div className='grid grid-cols-1 mt-7 mb-1 pb-3'>
                  <div className='font-Roboto relative'>
                    <ErrorMessage name='email' component='div' className='text-redd text-xs absolute -top-5' />
                    <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='email' name='email' placeholder='Email' />
                  </div>
                  <div className='font-Roboto relative mt-8'>
                    <ErrorMessage name='full_name' component='div' className='text-redd text-xs absolute -top-5' />
                    <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='full_name' placeholder='Full Name' />
                  </div>
                  <div className='font-Roboto relative mt-8'>
                    <ErrorMessage name='birth_date' component='div' className='text-redd text-xs absolute -top-5' />
                    <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='date' name='birth_date' placeholder='Birth Date' />
                  </div>
                  <div className='font-Roboto relative mt-8'>
                    <ErrorMessage name='join_date' component='div' className='text-redd text-xs absolute -top-5' />
                    <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='date' name='join_date' placeholder='Join Date' />
                  </div>
                  <div className='font-Roboto relative mt-8'>
                    <ErrorMessage name='salary' component='div' className='text-redd text-xs absolute -top-5' />
                    <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='number' name='salary' placeholder='Salary' />
                  </div>
                </div>
                <button
                  className="w-full py-2 my-4 text-xs font-Roboto tracking-wide border rounded-md bg-steel_b text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Register
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistrationForm;


