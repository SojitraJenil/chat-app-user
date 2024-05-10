import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaUserCircle } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { IoSend } from "react-icons/io5";
import { MdArrowBack, MdCall, MdOutlineEmojiEmotions } from "react-icons/md";
import { IoMdClose, IoMdVideocam } from "react-icons/io";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { GoPaperclip } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import dynamic from "next/dynamic";
import EmojiPicker from "emoji-picker-react";
import Dropdownmenu from "./Dropdownmenu";
import Maintenance from "../maintenance/Maintenance";

function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false); // Track user typing
  const [Loader, setLoader] = useState(true);
  const [IsSearch, SetSearch] = useState(false)
  const [ChatOrMic, setChatOrMic] = useState(true);
  const [user, setUser] = useState<string | null>(""); // Initialize user state variable
  const messagesRef = collection(db, "Message");
  const router = useRouter();
  const cookies = new Cookies();
  const authToken = cookies.get("auth-token");
  const uniqueId = generateUniqueId();
  var room = getCookie("room");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [installPrompt]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser.displayName || "");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room || ""));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages: any = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = messages
        .slice()
        .sort((a: any, b: any) => a.createdAt - b.createdAt);
      setLoader(false);
      setMessages(sortedMessages);
      setLoader(false);
    });

    return () => unsubscribe();
  }, []);

  function getCookie(name: any) {
    // Check if document object is available (specific to browser environments)
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
  function deleteCookie(name: any) {
    document.cookie =
      name + "=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }
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

  function generateUniqueId() {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomPart = Math.random().toString(36).substring(2, 7); // Generate random string
    const uniqueId = `${timestamp}${randomPart}`; // Concatenate timestamp and random string

    return uniqueId;
  }

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      Swal.fire({
        text: "Enter The Text...!",
        showClass: {
          popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `,
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `,
        },
      });
      return;
    }

    // If the message is not empty, add it to the Firestore collection
    setNewMessage("");
    const displayName = auth.currentUser?.displayName || "Anonymous"; // Providing a default name if display name is not available
    await addDoc(messagesRef, {
      id: uniqueId,
      text: newMessage,
      createdAt: new Date().getTime(),
      user: displayName,
      room,
    });
  };


  const logout = () => {
    Swal.fire({
      title: "Are you sure want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCookie("room");
        router.push("/join");
      }
    });
  };

  const removeEmojis = (text: any) => {
    // Regular expression to match emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}]/gu;
    // Replace emojis with an empty string
    return text.replace(emojiRegex, '');
  };

  const MessageHandler = (event: any) => {
    const message = event.target.value;
    const messageWithoutEmojis = removeEmojis(message);

    console.log(messageWithoutEmojis.length);
    setNewMessage(message);
    if (messageWithoutEmojis.trim().length === 0) {
      setChatOrMic(true);
    } else {
      setChatOrMic(false);
      if (message) {
        setTyping(true);
      }
    }
  };

  // Function to handle user typing timeout
  const handleTypingTimeout = () => {
    setTyping(false);
  };

  useEffect(() => {
    // Set a timeout to clear typing status
    const typingTimeout = setTimeout(handleTypingTimeout, 1000);
    return () => clearTimeout(typingTimeout);
  }, [newMessage]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  const handleInstallButtonClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
      } catch (error) {
        console.error("Error prompting installation:", error);
      }
    }
  };

  const HandleSearch = (e: any) => {
    var message = e.target.value;
    console.log(message);
  }

  const ShowSearch = () => {
    SetSearch(true)
  }
  const containRef = useRef<HTMLDivElement>(null);

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
          {
            IsSearch
              ?
              <div className="flex justify-between items-center border-b border-black pb-2 p-2 rounded-md mb-4 border-bottom text-white bg-[#035F51] sticky sm:px-4 lg:px-8 xl:px-2">
                <div className="flex items-center  w-full sm:w-auto">
                  <MdArrowBack className="text-2xl mx-2  me-3 mt-3 mb-[10px] " onClick={() => { SetSearch(false) }} />
                  <div className="relative w-full sm:w-auto md:w-[290px] lg:w-[290px]">
                    <input onClick={HandleSearch} type="text" className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 p-2.5 sm:w-[290px] md:w-[290px] lg:w-[290px]" placeholder="Search Messages..." required />
                  </div>
                  <button type="submit" className="bg-transparent border border-gray-300 border-1 text-white rounded-lg px-4 py-2 ml-2 hover:bg-blue-600 transition duration-300 ease-in-out sm:ml-2">Search</button>
                </div>
              </div>
              :
              <div className="flex justify-between items-center border-b border-black pb-2 p-2 rounded-md mb-4 border-bottom text-white bg-[#035F52] sticky sm:px-4 lg:px-8 xl:px-2 z-50">
                <div className="flex ps-1 ">
                  <MdArrowBack
                    className="text-2xl mr-1 me-3 mt-3"
                    onClick={() => { router.push("/users") }}
                  />
                  <FaUserCircle className="w-8 h-8 mr-1 mt-2 " />
                  <div className="font-semibold ps-2">
                    <p className="text-lg">{Loader ? "loading..." : user?.toUpperCase()}</p>
                    {typing ? (
                      <div className="message_content w-[100%] flex justify-start">
                        <div className="justify-between ">
                          <span className="font-bold text-[12px] w-auto">{user} typing...</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm">{Loader ? "loading..." : `Id: ${room}`}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pe-2 items-center w-[50%] justify-end cursor-pointer">
                  <IoMdVideocam className="text-2xl" />
                  <MdCall className="text-2xl" />
                  <Dropdownmenu ShowSearch={ShowSearch} handleInstallButtonClick={handleInstallButtonClick} logout={logout} />
                </div>
              </div>
          }
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
              {Loader ? (
                <>
                  <div className="flex justify-center align-bottom mt-8">
                    <RotatingLines
                      visible={true}
                      width={"40"}
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  </div>

                  {/* <Maintenance /> */}
                </>

              ) : (
                messages.map((data, index) => (
                  <div key={index}>
                    {(index === 0 ||
                      formatDateTime(data.createdAt).formattedDate !==
                      formatDateTime(messages[index - 1].createdAt)
                        .formattedDate) && (
                        <center>
                          <div className="mb-2">
                            <span className="px-4 bg-white h-auto rounded-md">
                              {formatDateTime(data.createdAt).formattedDate}{" "}
                            </span>
                          </div>
                        </center>
                      )}
                    <div
                      className={`message_content flex ${user === data.user ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`message_content flex ${user === data.user ? "hidden" : "justify-start"
                          }`}
                      >
                        <FaUserCircle className="w-5 h-8 mr-2" />
                      </div>

                      <div
                        className={`${user === data.user ? "bg-[#D9FDD3]" : "bg-[#ffffff]"
                          } text-dark rounded-lg p-2`}
                        style={{ maxWidth: "300px" }}
                      >
                        <div className="justify-between max-w-[300px]">
                          <span
                            className={`font-bold ${user === data.user ? "hidden" : "block"
                              }`}
                          >
                            {data.user}-:
                          </span>
                          <span
                            className="whitespace-normal "
                            style={{ wordWrap: "break-word" }}
                          >
                            {data.text}
                          </span>
                          <div style={{ fontSize: "10px" }}>
                            <span>
                              {formatDateTime(data.createdAt).formattedTime}
                            </span>
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
                onClick={toggleEmojiPicker}
              >
                {
                  showEmojiPicker ? <IoMdClose /> : <MdOutlineEmojiEmotions />
                }

              </div>
              <div className="absolute bottom-12">
                {showEmojiPicker && (
                  <EmojiPicker
                    style={{ width: "100%" }}
                    onEmojiClick={handleEmojiClick}
                  />
                )}
              </div>
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={MessageHandler}
              placeholder="Message... "
              className="w-[20%] flex-grow border  px-4 py-3 focus:outline-none focus:border-transparent  border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div className="bg-white flex gap-4 py-[11px] pe-3 rounded-r-full text-2xl">
              <FaCamera className="text-xl" />
              <GoPaperclip />
              <RiMoneyRupeeCircleFill />
            </div>
            {ChatOrMic ? (
              <button
                className="ml-2 bg-[#035F52]  text-white  p-4 rounded-[50%] send-button"
                type="submit"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                className="ml-2 bg-[#035F52]  text-white  p-4 rounded-[50%] send-button"
                type="submit"
                onClick={sendMessage}
              >
                <IoSend />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Chat), { ssr: false });
