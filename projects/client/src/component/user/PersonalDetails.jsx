import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import dayjs from 'dayjs';

export default function UserProfile() {
    const [userProfile, setUserProfile] = useState({});
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const responseProfile = await axios.get("http://localhost:8000/api/auth/user-profile", { headers: { Authorization: `Bearer ${token}` } });
                setUserProfile(responseProfile.data.data);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchUserProfile();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center">
            <div className="max-w-md bg-white shadow-md rounded-lg p-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">Personal Details</h1>
                </div>
                <div className="text-left">
                    <p><strong>Name:</strong> {userProfile.full_name}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Birth Date:</strong> {dayjs(userProfile.birth_date).format('DD MMMM YYYY')}</p>
                    <p><strong>Join Date:</strong> {dayjs(userProfile.join_date).format('DD MMMM YYYY')}</p>
                    <p><strong>Basic Salary:</strong> {userProfile.Salary ? userProfile.Salary.basic_salary : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}
