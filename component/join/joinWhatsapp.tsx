import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import dynamic from "next/dynamic";
import { start } from "repl";

function Join() {
  const cookies = new Cookies();
  const authToken = cookies.get("auth-token");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<string | number>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [roomError, setRoomError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const roomFromCookie = cookies.get("room");
    if (roomFromCookie) {
      router.push(`/chat`);
    }
  }, [cookies, router]);

  useEffect(() => {
    if (!authToken) {
      router.push("/authentication");
    }
  }, [authToken, router]);

  const JoinRoomHandler = () => {
    let hasError = false;
    if (!username) {
      setUsernameError("Name is required.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!room) {
      setRoomError("Mobile No is required.");
      hasError = true;
    } else {
      setRoomError("");
    }

    if (hasError) return;
    setLoading(true);

    setCookie("room", room, 7);
    setCookie("username", username, 7);
    router.push(`/chat`);
    setLoading(false);
  };

  function setCookie(name: string, value: string | number, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
  }

  return (
    <div className="relative bg-gray-200">
      <div className="flex items-center justify-center h-screen relative z-30 ">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg opacity-80">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login{" "}
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              {usernameError && (
                <p className="mt-2 text-sm text-red-600">{usernameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile No
              </label>
              <input
                type="number"
                id="room"
                className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={room === 0 ? "" : room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room chat ID"
                required
              />
              {roomError && (
                <p className="mt-2 text-sm text-red-600">{roomError}</p>
              )}
            </div>
            <span className="text-sm text-blue-800">
              Please provide a dummy mobile number.
            </span>
            <p className="text-sm text-blue-800">
              <span>Click on read </span>
              <a href="Rules" className="underline">
                Rules...
              </a>
            </p>
            <div>
              <button
                onClick={JoinRoomHandler}
                type="button"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Join Room"
                )}
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
