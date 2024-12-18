import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { RotatingLines } from 'react-loader-spinner';
import moment from 'moment';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { receiverDetails } from '@/store/atoms';

const WhatsAppUI = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [receiveUser, setReceiveUser] = useAtom<any>(receiverDetails);
    const [loading, setLoading] = useState<boolean>(false);

    const GetCurrentUser = () => {
        const CurrentMobileNo: any = getCookie("mobileno");
        const CurrentEmail: any = getCookie("email");
        const CurrentName: any = getCookie("name");
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
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const usersCollectionRef = collection(db, "Users");
            try {
                const querySnapshot = await getDocs(usersCollectionRef);
                const usersList = querySnapshot.docs
                    .map((doc: any) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((user: any) => {
                        return user.mobileNo != GetCurrentUser().CurrentMobileNo || user.email != GetCurrentUser().CurrentEmail;
                    });
                console.log('usersList :>> ', usersList);
                setUsers(usersList);
                setReceiveUser(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const formatDateTime = (timestamp: number) => {
        if (!timestamp) {
            return { formattedDate: "", formattedTime: "" };
        }
        const jsDate = new Date(timestamp);
        const formattedDate = moment(jsDate).format("DD-MM-YYYY");
        const formattedTime = moment(jsDate).format("hh:mm A");

        return { formattedDate, formattedTime };
    };

    return (
        <div className="bg-white min-h-screen p-2">
            <h6 className="bg-orange-600 text-center text-white font-semibold  px-1 rounded-md shadow-md text-lg">
                Feed
            </h6>
            {loading && (
                <div className="flex justify-center items-center my-20">
                    <RotatingLines
                        visible={true}
                        width={"40"}
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
            )}

            {!loading && users.length === 0 && (
                <div className="flex justify-center items-center mt-16">
                    <p className="text-gray-500 text-xl">No users found</p>
                </div>
            )}

            <div className="space-y-1 py-1">
                {users.filter(user => user.username.toLowerCase()).map((user, index) => {
                    const { formattedDate, formattedTime } = formatDateTime(user.createdAt);

                    return (
                        <div key={index} className="flex items-center  bg-gray-50 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                            <div className="mr-4">
                                <FaUserCircle className="w-16 h-16 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <div className="block text-lg font-semibold text-blue-600 hover:text-blue-800">
                                    {user.username}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    <p>{user.email}</p>
                                    <p>{user.mobileNo}</p>
                                    <p>{formattedDate}</p>
                                </div>
                            </div>
                            <div>
                                <Link href={`/user/${user.mobileNo}`}>
                                    <button className=" py-1 mr-2 rounded-md bg-green-600 text-white px-2">
                                        Chat
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}

export default WhatsAppUI;
