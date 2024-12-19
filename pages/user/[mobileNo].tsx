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
import { MdArrowBack } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import moment from "moment";
import { useAtom } from "jotai";
import { receiverDetails } from "@/store/atoms";
import { RotatingLines } from "react-loader-spinner";

const UserChat = () => {
    const router = useRouter();
    const { mobileNo } = router.query;

    const [receiveUser] = useAtom(receiverDetails);
    const [receiveName, setReceiveName] = useState("Unknown User");
    const [loader, setLoader] = useState(false);
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState("");
    const containRef = useRef<any>(null);

    // Extract receiver details
    useEffect(() => {
        if (Array.isArray(receiveUser)) {
            const Receiver = receiveUser.find((item) => item.mobileNo === mobileNo);
            setReceiveName(Receiver?.username || "Unknown User");
        }
    }, [receiveUser, mobileNo]);

    // Helper to get cookies
    const getCookie = (name: any) => {
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
    const chatRoomId = [CurrentMobileNo, mobileNo].sort().join("_");

    // Fetch messages in real-time
    useEffect(() => {
        setLoader(true)
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
            setLoader(false)
        });

        return () => unsubscribe();
    }, [mobileNo, CurrentMobileNo, chatRoomId]);

    // Send a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

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

    // Format timestamp
    const formatDateTime = (timestamp: any) => {
        if (!timestamp) return { formattedDate: "", formattedTime: "" };

        const jsDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return {
            formattedDate: moment(jsDate).format("DD-MM-YYYY"),
            formattedTime: moment(jsDate).format("hh:mm A"),
        };
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        if (containRef.current) {
            containRef.current.scrollTop = containRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-100">
                <div className="bg-teal-600 text-white py-4 px-6 flex items-center">
                    <MdArrowBack
                        className="text-2xl cursor-pointer"
                        onClick={() => router.push("/users")}
                    />
                    <div className="ml-4">
                        <p className="text-lg font-semibold">{receiveName}</p>
                        <p className="text-sm text-gray-200">{mobileNo}</p>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto px-4 py-2" ref={containRef}>
                    {loader ?
                        <div className="flex items-center justify-center pt-20">
                            <RotatingLines width="50" strokeColor="#035F51" />
                        </div>
                        :
                        messages.map((data: any, index: any) => (
                            <div key={data.id}>
                                {(index === 0 ||
                                    formatDateTime(data.timestamp).formattedDate !==
                                    formatDateTime(messages[index - 1]?.timestamp).formattedDate) && (
                                        <div className="text-center my-2 text-sm text-gray-500">
                                            {formatDateTime(data.timestamp).formattedDate}
                                        </div>
                                    )}
                                <div
                                    className={`flex mb-2 ${data.sender === CurrentMobileNo ? "justify-end" : "justify-start"
                                        }`}
                                >

                                    <div
                                        className={`p-3 rounded-lg text-sm shadow-md ${data.sender === CurrentMobileNo
                                            ? "bg-teal-500 text-white"
                                            : "bg-white text-gray-800"
                                            }`}
                                        style={{ maxWidth: "75%" }}
                                    >
                                        <p>{data.text}</p>
                                        <span className="block mt-1 text-xs text-right">
                                            {formatDateTime(data.timestamp).formattedTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="flex items-center bg-white p-4 border-t">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        className="ml-3 bg-teal-500 text-white p-3 rounded-full shadow-lg focus:outline-none"
                        onClick={handleSendMessage}
                    >
                        <IoSend className="text-xl" />
                    </button>
                </div>
            </div>
        </>

    );
};

export default UserChat;
