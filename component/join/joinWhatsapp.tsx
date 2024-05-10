import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import dynamic from "next/dynamic";

function Join() {
  const cookies = new Cookies();
  const authToken = cookies.get("auth-token");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<string | number>("");
  const router = useRouter()
  useEffect(() => {
    const roomFromCookie = cookies.get("room");
    if (roomFromCookie) {
      router.push(`/chat`);
    }
  }, [cookies, router]);

  const JoinRoomHandler = () => {
    if (!username || !room) {
      Swal.fire({
        text: "Enter The UserName and RoomID...!",
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
    setCookie("room", room, 7);
    router.push(`/chat`);
  };

  function setCookie(name: any, value: any, days: any) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
  }

  return (
    <div className="relative bg-gray-200">
      <div className="flex items-center justify-center h-screen relative z-30 ">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg opacity-80">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login{" "}
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-2 text-black block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700"
              >
                Chat Room ID
              </label>
              <input
                type="number"
                id="room"
                className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={room == 0 ? '' : room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room chat ID"
                required
              />
            </div>
            <div>
              <button
                onClick={JoinRoomHandler}
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Room
              </button>
            </div>
          </form>
          <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-70 duration-300 text-[#002D74]">
            <FcGoogle className="text-2xl me-4" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Join), { ssr: false });
