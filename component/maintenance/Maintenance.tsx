import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function Maintenance() {
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center">
        <Image
          src={require("../../image/download.svg")}
          alt="Maintenance"
          width={300}
          height={300}
          className="mx-auto"
        />
        <p className="my-3 font-bold text-center text-xl animate-bounce">
          We are under Maintenance
        </p>
        <p className="text-lg mt-2">
          Estimated time to complete:{" "}
          <span className="font-bold">{formatTime(countdown)}</span>
        </p>
        <div className="mt-5">
          <p className="text-sm">
            For urgent queries, contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-500 underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
      <div className="mt-10 flex justify-center gap-5">
        <Link href="https://www.facebook.com">
          <span
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Facebook
          </span>
        </Link>
        <Link href="https://www.twitter.com">
          <span
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            Twitter
          </span>
        </Link>
        <Link href="https://www.instagram.com">
          <span
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            Instagram
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Maintenance;
