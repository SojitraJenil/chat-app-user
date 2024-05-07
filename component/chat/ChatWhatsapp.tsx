import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaUserCircle } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { IoSend } from "react-icons/io5";
import { MdArrowBack, MdCall, MdOutlineEmojiEmotions } from "react-icons/md";
import { IoMdRefresh, IoMdVideocam } from "react-icons/io";
import { GrLogout } from "react-icons/gr";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { GoDownload, GoPaperclip } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from 'next/router'
import Cookies from "universal-cookie";
import dynamic from "next/dynamic";

function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [Loader, setLoader] = useState(true);
  const [ChatOrMic, setChatOrMic] = useState(true);
  const [user, setUser] = useState(""); // Initialize user state variable
  const messagesRef = collection(db, "Message");
  const router = useRouter()
  const cookies = new Cookies();
  const authToken = cookies.get("auth-token");
  const uniqueId = generateUniqueId();
  var room = getCookie("room");

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
    if (!authToken) {
      router.push("/authentication");
    }
  }, [authToken, router]);

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser.displayName || '');
    }
  }, [auth.currentUser]);

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
      console.log(sortedMessages);
            setLoader(false);
    });

    return () => unsubscribe();
  }, []);


  function getCookie(name: any) {
    // Check if document object is available (specific to browser environments)
    if (typeof document !== 'undefined') {
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
    await addDoc(messagesRef, {
      id: uniqueId,
      text: newMessage,
      createdAt: new Date().getTime(),
      user: auth.currentUser?.displayName,
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

  const MessageHandler = (event: any) => {
    const message = event.target.value;
    setNewMessage(message);
    if (message.trim().length === 0) {
      setChatOrMic(true);
    } else {
      setChatOrMic(false);
    }
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

  const BackHandler =()=>{
    router.push('/users')
  }

  const containRef = useRef<HTMLDivElement>(null);

  return (

    <div >

      <div className="container mx-auto h-screen max-w-md text-sm">
        <div
          className="rounded-lg shadow-lg shadow-black mb-4 bg-cover	 h-screen flex flex-col"
          style={{
            backgroundImage:
              'url("https://i.ibb.co/3s1f9Jq/default-wallpaper.png")',
          }}
        >
          <div className="flex justify-between items-center border-b border-black pb-2 p-2 rounded-md mb-4 border-bottom text-white bg-[#035F52] sticky   0 z-50 sm:px-4 lg:px-8 xl:px-2 ">

            <div className="flex ps-1 w-[50%]">
              <MdArrowBack className="w-6 h-6 mr-1 mt-3" onClick={BackHandler} />
              <FaUserCircle className="w-8 h-8 mr-1 mt-2 " />
              <div className="font-semibold ps-2">
                <p className="text-lg">{user}</p>
                <p className="text-sm">Room -:{room}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pe-2 items-center w-[50%] justify-end">
              <IoMdVideocam className="text-2xl" />
              <MdCall className="text-2xl" />
              <GoDownload onClick={handleInstallButtonClick} className="text-2xl fw-bold" />
              <IoMdRefresh
                onClick={() => window.location.reload()}
                className="text-2xl"
              />
              <GrLogout onClick={logout} className="text-xl " />
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
              {Loader ? (
                <div className="flex justify-center align-bottom mt-8">
                  <RotatingLines
                    visible={true}
                    width={"40"}
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                  />
                </div>
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
                            <span>{formatDateTime(data.createdAt).formattedTime}</span>
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
            <div className="bg-white py-[11px] ps-3 rounded-l-full text-2xl">
              <MdOutlineEmojiEmotions />
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={MessageHandler}
              placeholder="Message... "
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className=" w-[20%] flex-grow border  px-4 py-3 focus:outline-none focus:border-transparent  border-transparent"
            />
            <div className="bg-white flex gap-4 py-[11px] pe-3 rounded-r-full text-2xl">
              <FaCamera className="text-xl" />
              <GoPaperclip />
              <RiMoneyRupeeCircleFill />
            </div>
            {
              ChatOrMic ?
                <button
                  className="ml-2 bg-[#035F52]  text-white  p-4 rounded-[50%] send-button"
                  type="submit">
                  <FaMicrophone />
                </button> :
                <button
                  className="ml-2 bg-[#035F52]  text-white  p-4 rounded-[50%] send-button"
                  type="submit" onClick={sendMessage}>
                  <IoSend />
                </button>
            }
          </div>

        </div>
      </div>
    </div>

  );
}

export default dynamic(() => Promise.resolve(Chat), { ssr: false });
