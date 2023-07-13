import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function RegisterEmployee() {

    
    const navigate = useNavigate();
    
    if (req.user.role !== 2) {
        res.redirect('/');
    }


    const initialValues = {
        username: '',
        full_name: '',
        email: '',
        birthdate: '',
        join_date: '',
        role_id: '',
        salary: '',
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        full_name: Yup.string().required("Full Name is required"),
        email: Yup.string().email('Please use a valid email format').required('Email is required'),
        birthdate: Yup.date().required("Birthdate is required"),
        join_date: Yup.date().required("Join date is required"),
        role_id: Yup.number().required("Role ID is required"),
        salary: Yup.number().required('Salary is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/registerUser', values);

            if (response.status === 201) {
                resetForm();
                setStatus({ success: true, message: 'User registration successful!' });
            }

        } catch (error) {
            const response = error.response;
            if (response.status === 400 || response.status === 403) {
                const { message } = response.data;
                setStatus({ success: false, message: message });
            }

            if (response.status === 500) {
                setStatus({ success: false, message: "Internal Server Error" });
            }

        } finally {
            setSubmitting(false);
            setTimeout(() => {
                navigate("/adminDashboard");
            }, 3000);
        }
    };

    return (
        <div className='grid justify-center mt-3'>
            <div className='w-screen grid grid-flow-row justify-center'>
                <div>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting, status }) => (
                            <Form>
                                <div className='grid grid-flow-row gap-1 justify-center'>
                                    <h3 className='w-72 text-xl text-center font-josefin mt-4 text-jetblack tracking-wide font-semibold sm:text-2xl'>Register Employee</h3>
                                    <h3 className='text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-sm'>Please fill in the information below:</h3>
                                    <div className='w-full grid grid-flow-row gap-3'>
                                        {status && status.success && (
                                            <p className="font-ysa text-center text-greenn">{status.message}</p>
                                        )}
                                        {status && !status.success && (
                                            <p className="font-ysa text-center text-redd">{status.message}</p>
                                        )}
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='username' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='username' placeholder='Username' />
                                        </div>
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='full_name' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='full_name' placeholder='Full Name' />
                                        </div>
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='email' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='email' name='email' placeholder='Email' />
                                        </div>
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='birthdate' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='date' name='birthdate' placeholder='Birthdate' />
                                        </div>
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='join_date' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='date' name='join_date' placeholder='Join Date' />
                                        </div>
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='role_id' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='role_id' placeholder='Role ID' />
                                        </div>
                                        <div className='font-ysa relative mt-4'>
                                            <ErrorMessage name='salary' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='salary' placeholder='Salary' />
                                        </div>
                                    </div>
                                    <button
                                        className='w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen'
                                        type='submit'
                                        disabled={isSubmitting}
                                    >
                                        Register Employee
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className='text-center text-xs font-josefin tracking-wide  mb-6'>
                    <p>
                        Go back to
                        <button className='m-1'>
                            <span className='p-1 hover:border-b-2 hover:border-darkgreen font-semibold'><Link to='/adminDashboard'>Admin Dashboard</Link></span>
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
