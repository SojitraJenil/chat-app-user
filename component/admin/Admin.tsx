import { db } from '../../firebase';
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { Radio } from 'react-loader-spinner';

// Define an interface representing the structure of each message
interface Message {
    id: string;
    user: string;
    room: string;
    text: string;
    createdAt: string;
}

function Admin() {
    const [messages, setMessages] = useState<Message[]>([]); // Initialize state with an empty array of Message
    const [currentPage, setCurrentPage] = useState(1); // Initialize current page state
    const [itemsPerPage] = useState(10); // Set number of items per page

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, 'Message'));

            try {
                const querySnapshot = await getDocs(q);
                const messagesData = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Message;
                    // Convert firebase.firestore.Timestamp to string if required
                    const formattedDateTime = formatDateTime(data.createdAt);
                    return {
                        ...data,
                        createdAt: formattedDateTime.formattedDate + ' ' + formattedDateTime.formattedTime
                    };
                });
                setMessages(messagesData);
                console.log("Messages:", messagesData);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Message'), (snapshot) => {
            const messagesData = snapshot.docs.map(doc => {
                const data = doc.data() as Message;
                const formattedDateTime = formatDateTime(data.createdAt);
                return {
                    id: doc.id, // Document ID
                    user: data.user,
                    room: data.room,
                    text: data.text,
                    createdAt: formattedDateTime.formattedDate + ' ' + formattedDateTime.formattedTime
                };
            });
            setMessages(messagesData);
            console.log("Messages:", messagesData);
        });

        return () => unsubscribe(); // Unsubscribe when component unmounts
    }, []);



    const handleDelete = async (id: any) => {
        try {
            // Construct the reference to the message document
            const messageRef = doc(db, 'Message', id);

            // Delete the message document
            await deleteDoc(messageRef);

            // Update the messages state to remove the deleted message
            setMessages(messages.filter(message => message.id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };


    // Calculate total number of pages
    const totalPages = Math.ceil(messages.length / itemsPerPage);

    // Get current page messages
    const indexOfLastMessage = currentPage * itemsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

    // Handle pagination button click
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    // Function to format timestamp into date and time
    const formatDateTime = (timestamp: string) => {
        if (!timestamp) {
            return { formattedDate: "", formattedTime: "" };
        }
        // Convert timestamp to JavaScript Date object
        const jsDate = new Date(parseInt(timestamp));
        // Format the date and time using moment.js
        const formattedDate = moment(jsDate).format("DD-MM-YYYY");
        const formattedTime = moment(jsDate).format("hh:mm A");

        return { formattedDate, formattedTime };
    };


    return (
        <div>
            {currentMessages.length > 0 ? (
                <div className='px-5'>
                    <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th className="px-4 py-2">Index</th>
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2">Room Id</th>
                                    <th className="px-4 py-2">Text</th>
                                    <th className="px-4 py-2">Created At</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMessages.map((message, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100 text-center' : 'text-center'}>
                                        <td className="px-4 py-2 ">{index + 1}</td>
                                        <td className="px-4 py-2 ">{message.user}</td>
                                        <td className="px-4 py-2 ">{message.room}</td>
                                        <td className="px-4 py-2 ">{message.text}</td>
                                        <td className="px-4 py-2 ">{message.createdAt}</td>
                                        <td className="px-4 py-2 ">
                                            <button
                                                onClick={() => handleDelete(message.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination buttons */}
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mr-2 bg-blue-500 text-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className=" flex justify-center align-bottom mt-10">
                    <Radio
                        visible={true}
                        width="80"
                        ariaLabel="radio-loading"
                    /></div>
            )}

        </div>
    );
}
export default dynamic(() => Promise.resolve(Admin), { ssr: false });

