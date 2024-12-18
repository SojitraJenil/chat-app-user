import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { MdArrowBack, MdCall, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaCamera, FaMicrophone, FaUserCircle } from "react-icons/fa";
import { IoMdClose, IoMdVideocam } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import moment from "moment";
import { useAtom } from "jotai";
import { GoPaperclip } from "react-icons/go";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { receiverDetails } from "@/store/atoms";

const UserChat = () => {
    const router = useRouter();
    const { mobileNo } = router.query;

    // Atoms for receiver details
    const [receiveUser, setReceiveUser] = useAtom<any>(receiverDetails);
    const [receiveName, setReceiveName] = useState("");

    // Get receiver details from atom
    useEffect(() => {
        if (Array.isArray(receiveUser)) {
            const Receiver = receiveUser.find(
                (item: any) => item.mobileNo === mobileNo
            );
            const SingleName = Receiver ? Receiver.username : "Unknown User";
            setReceiveName(SingleName);
        }
    }, [receiveUser, mobileNo]);

    // Cookie helper function
    const getCookie = (name: string) => {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split("; ");
            for (const cookie of cookies) {
                const [key, value] = cookie.split("=");
                if (key === name) return value;
            }
        }
        return null;
    };
    const CurrentMobileNo = getCookie("mobileno");
    const CurrentName = getCookie("username");

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const containRef = useRef<HTMLDivElement>(null);

    const chatRoomId = [CurrentMobileNo, mobileNo].sort().join("_");
    useEffect(() => {
        if (!mobileNo || !CurrentMobileNo) return;

        const q = query(
            collection(db, "chats", chatRoomId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [mobileNo, CurrentMobileNo, chatRoomId]);

    // Send a new message
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        try {
            await addDoc(collection(db, "chats", chatRoomId, "messages"), {
                text: newMessage,
                sender: CurrentMobileNo,
                senderName: CurrentName,
                receiver: mobileNo,
                timestamp: serverTimestamp(),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const formatDateTime = (timestamp: any) => {
        if (!timestamp) {
            return { formattedDate: "", formattedTime: "" };
        }

        let jsDate;

        // Check if timestamp is a Firestore Timestamp object (has toDate method)
        if (timestamp.toDate) {
            jsDate = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
        } else if (timestamp instanceof Date) {
            jsDate = timestamp; // Already a JavaScript Date object
        } else if (typeof timestamp === "number") {
            jsDate = new Date(timestamp); // Unix timestamp in milliseconds
        } else if (typeof timestamp === "string") {
            jsDate = new Date(timestamp); // ISO 8601 string
        } else {
            throw new Error("Invalid timestamp format");
        }

        // Format the date and time using Moment.js
        const formattedDate = moment(jsDate).format("DD-MM-YYYY");
        const formattedTime = moment(jsDate).format("hh:mm A");

        return { formattedDate, formattedTime };
    };


    useEffect(() => {
        if (containRef.current) {
            containRef.current.scrollTop = containRef.current.scrollHeight;
        }
    }, [messages]);


    return (
        <div>
            <div className="container mx-auto h-screen max-w-md text-sm">
                <div
                    className="rounded-lg shadow-lg shadow-black mb-4 bg-cover h-screen flex flex-col"
                    style={{
                        backgroundImage:
                            'url("https://i.ibb.co/3s1f9Jq/default-wallpaper.png")',
                    }}
                >
                    <div className="flex justify-between items-center border-b border-black pb-2 p-2 rounded-md mb-4 border-bottom text-white bg-[#035F52] sticky sm:px-4 lg:px-8 xl:px-2 z-50">
                        <div className="flex ps-1 ">
                            <MdArrowBack
                                className="text-2xl mr-1 me-3 mt-3"
                                onClick={() => {
                                    router.push("/users");
                                }}
                            />
                            <FaUserCircle className="w-8 h-8 mr-1 mt-2 " />
                            <div className="font-semibold ps-2">
                                <div>
                                    <p className="font-semibold text-xs">{receiveName}</p>
                                    <p className="text-xs">{`${mobileNo}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pe-2 items-center w-[50%] justify-end cursor-pointer">
                            <IoMdVideocam className="text-2xl" />
                            <MdCall className="text-2xl" />
                            {/* <Dropdownmenu
                                        ShowSearch={ShowSearch}
                                        handleInstallButtonClick={handleInstallButtonClick}
                                        logout={logout}
                                    /> */}
                        </div>
                    </div>

                    <div
                        className="flex-grow overflow-y-auto"
                        ref={containRef}
                        style={{
                            overflowY: "scroll",
                            scrollbarWidth: "none",
                            scrollbarColor: "transparent transparent",
                        }}
                    >
                        <div className="space-y-4 px-2">
                            {false ? (
                                <>
                                    <div className="flex justify-center items-center my-20">
                                        <RotatingLines
                                            visible={true}
                                            width={"40"}
                                            strokeWidth="5"
                                            animationDuration="0.75"
                                            ariaLabel="rotating-lines-loading"
                                        />
                                    </div>
                                </>
                            ) : (

                                messages.map((data: any, index: any) => (
                                    <div key={index}>
                                        {(index === 0 ||
                                            (data.timestamp &&
                                                formatDateTime(data.timestamp).formattedDate !==
                                                formatDateTime(messages[index - 1]?.timestamp)?.formattedDate)) && (
                                                <center>
                                                    <div className="mb-2">
                                                        <span className="px-4 bg-white h-auto rounded-md">
                                                            {formatDateTime(data.timestamp).formattedDate}
                                                        </span>
                                                    </div>
                                                </center>
                                            )}
                                        <div className={`message_content flex ${data.sender === CurrentMobileNo ? "justify-end" : "justify-start"}`}>
                                            <div className={`${data.sender === CurrentMobileNo ? "bg-[#D9FDD3]" : "bg-[#ffffff]"} text-dark rounded-lg p-2`} style={{ maxWidth: "300px" }}>
                                                <div className="justify-between max-w-[300px]">
                                                    <span className="whitespace-normal" style={{ wordWrap: "break-word" }}>
                                                        {data.text}
                                                    </span>
                                                    <div style={{ fontSize: "10px" }}>
                                                        <span>{formatDateTime(data.timestamp).formattedTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex items-center mt-4 p-2 w-full ">
                        <div className="relative">
                            <div
                                className="bg-white py-[11px] ps-3 rounded-l-full text-2xl cursor-pointer"
                            >
                                {false ? <IoMdClose /> : <MdOutlineEmojiEmotions />}
                            </div>
                        </div>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message... "
                            className="w-[20%] flex-grow border  px-4 py-3 focus:outline-none focus:border-transparent  border-transparent"
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <div className="bg-white flex gap-4 py-[11px] pe-3 rounded-r-full text-2xl">
                            <FaCamera className="text-xl" />
                            <GoPaperclip />
                            <RiMoneyRupeeCircleFill />
                        </div>

                        <button
                            className="ml-2 bg-[#035F52]  text-white  p-4 rounded-[50%] send-button"
                            type="submit"
                        >
                            <FaMicrophone />
                        </button>
                        <button
                            className="ml-2 bg-[#035F52]  text-white  p-4 rounded-[50%] send-button"
                            type="submit"
                            onClick={handleSendMessage}
                        >
                            <IoSend />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UserChat;
