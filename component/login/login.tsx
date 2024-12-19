import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { query, where, getDocs, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

function Login() {
  const cookies = new Cookies();
  const [username, setUsername] = useState("");
  const [mobileNo, setMobileNo] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; mobileNo?: string }>(
    {}
  );
  const router = useRouter();
  const { email }: any = router.query;

  useEffect(() => {
    const authToken = cookies.get("auth-token");
    if (authToken) {
      console.log("Navigating to /dashboard");
      router.push("/users");
    }
  }, [cookies, router]);

  const usersRef = collection(db, "Users");

  const setCookie = (name: string, value: string | number, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
  };

  const validateInputs = () => {
    const newErrors: typeof errors = {};
    if (!username) newErrors.username = "Name is required.";
    if (!mobileNo) newErrors.mobileNo = "Mobile number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJoinRoom = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      // Check if user with the same mobile number already exists
      const userQuery = query(usersRef, where("mobileNo", "==", mobileNo));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // User exists: log in
        const existingUser = querySnapshot.docs[0].data();
        setCookie("mobileno", existingUser.mobileNo, 7);
        setCookie("email", existingUser.email, 7);
        setCookie("username", existingUser.username, 7);
        alert("User already exists. Logging in...");
      } else {
        // New user: create account
        await addDoc(usersRef, {
          username,
          mobileNo,
          email,
          createdAt: new Date().getTime(),
        });
        setCookie("mobileno", mobileNo, 7);
        setCookie("email", email, 7);
        setCookie("username", username, 7);
        alert("New user created successfully.");
      }

      router.push("/users");
    } catch (error) {
      console.error("Error handling login or registration:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-200">
      <div className="flex items-center justify-center h-screen relative z-30">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg opacity-80">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login ({email})
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
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="mobileNo"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="number"
                id="mobileNo"
                className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={mobileNo || ""}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="Enter mobile number"
                required
              />
              {errors.mobileNo && (
                <p className="mt-2 text-sm text-red-600">{errors.mobileNo}</p>
              )}
            </div>
            <span className="text-sm text-blue-800">
              Please provide a dummy mobile number.
            </span>
            <div>
              <button
                onClick={handleJoinRoom}
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
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
