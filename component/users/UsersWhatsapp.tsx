import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { Message } from 'postcss';
import React, { useEffect, useState } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { FaCamera, FaUserCircle } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import { RotatingLines } from 'react-loader-spinner';

const WhatsAppUI = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]); // State for filtered messages
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [Loader, setLoader] = useState(true);
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, 'Message'));

            try {
                const querySnapshot = await getDocs(q);
                const messagesData = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Message;
                    return {
                        ...data,
                    };
                });
                setMessages(messagesData);
                setFilteredMessages(messagesData);
                setLoader(false)
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // Filter messages based on search query whenever searchQuery changes
        const filtered = messages.filter(message =>
            message.user.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMessages(filtered);
    }, [searchQuery, messages]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const HandleUser = () => {
        router.push('/chat')
    }

    return (
        <>
            <div className="bg-white border ">
                <div className="w-full h-screen flex bg-gray-50 border-black container mx-auto max-w-md text-sm ">
                    <div className="bg-gray-200 overflow-y-auto rounded-lg shadow-lg shadow-black mb-4 bg-cover h-screen border border-gray-800 relative block" style={{
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                        scrollbarColor: "transparent transparent",
                        width: "40rem"
                    }}>
                        <div className="aside-header sticky top-0 right-0 left-0 z-40 text-gray-400 bg-[#035F52]">
                            <div className="flex items-center px-4 py-3 border-b-2 border ">
                                <div className="flex-1 text-green-100">
                                    <p className='text-2xl font-sans font-semibold'>WhatsApp</p>
                                </div>
                                <div className="text-white flex gap-4 py-2 pe-3 rounded-r-full text-2xl">
                                    <FaCamera />
                                    <IoSearchSharp />
                                    <CiMenuKebab />
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                Loader ?
                                    <div className="flex justify-center align-bottom mt-8">
                                        <RotatingLines
                                            visible={true}
                                            width={"40"}
                                            strokeWidth="5"
                                            animationDuration="0.75"
                                            ariaLabel="rotating-lines-loading"
                                        />
                                    </div> :
                                    filteredMessages.map((data: any, index: number) => {
                                        let currentDate = '';
                                        let previousDate = '';

                                        if (data.createdAt instanceof Date) {
                                            currentDate = data.createdAt.toDateString();
                                        } else if (typeof data.createdAt === 'string') {
                                            currentDate = new Date(data.createdAt).toDateString();
                                        }

                                        if (index > 0 && messages[index - 1].createdAt) {
                                            if (messages[index - 1].createdAt instanceof Date) {
                                                previousDate = messages[index - 1].createdAt.toDateString();
                                            } else if (typeof messages[index - 1].createdAt === 'string') {
                                                previousDate = new Date(messages[index - 1].createdAt).toDateString();
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {previousDate !== currentDate && (
                                                    <div className="mb-2">
                                                        <span className="px-4 bg-white h-auto rounded-md">
                                                            {data.user}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center px-4 py-3 border-b-2  bg-gray-50" onClick={HandleUser} >
                                                    <div className="text-black">
                                                        <FaUserCircle className="w-10 h-10 mr-2 " />
                                                    </div>
                                                    <div className="text-black pb-1">
                                                        <p className='text-[18px] ps-3 font-semibold'>{data.user} </p>
                                                        <span className='text-[14px] text-gray-600 ps-3 font-semibold'>{data.text}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })

                            }

                        </div>
                    </div>
                    <div />
                </div>
            </div >
        </>
    );
}

export default WhatsAppUI;
