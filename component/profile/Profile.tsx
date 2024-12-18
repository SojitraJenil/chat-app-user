import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Optional: Icon for default profile

const Profile = () => {
    // Use a dummy user object for testing
    const [user, setUser] = useState<any>(null); // Store user data
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    // Dummy user object (simulate Firebase user data)

    const GetCurrentUser = () => {
        const CurrentMobileNo: any = getCookie("mobileno");
        const CurrentEmail: any = getCookie("email");
        const CurrentName: any = getCookie("username");
        return { CurrentMobileNo, CurrentEmail, CurrentName }
    }

    function getCookie(name: any) {
        if (typeof document !== "undefined") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.startsWith(name + "=")) {
                    return cookie.substring(name.length + 1);
                }
            }
        }
        return null;
    }
    const dummyUser = {
        username: "John Doe",
        email: "john.doe@example.com",
        mobileNo: "+1234567890",
        profilePicture: "", // Optional: You can add an image URL here
    };

    useEffect(() => {
        // Simulate a loading state
        setLoading(true);
        setTimeout(() => {
            setUser(dummyUser); // Set the dummy data as the user object
            setLoading(false); // Stop loading
        }, 1000); // Simulate a 1-second delay for fetching data
    }, []);

    // Display loading spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full border-4 border-t-transparent border-gray-400 w-12 h-12"></div>
            </div>
        );
    }

    // If user is not found, show a message
    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-6">
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle className="w-24 h-24 text-gray-400" />
                    )}
                </div>

                {/* Profile Details */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">mobile no -: {GetCurrentUser().CurrentMobileNo}</h2>
                    <p className="text-gray-600">Email :- {GetCurrentUser().CurrentEmail}</p>
                    <p className="text-gray-600">userName -: {GetCurrentUser().CurrentName}</p>
                </div>

                {/* Profile Edit Button */}
                <div className="flex justify-center mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                        Edit Profile
                    </button>
                </div>

                {/* Logout Button */}
                <div className="flex justify-center mt-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
