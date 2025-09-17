"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiInstagram } from "react-icons/fi";
const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you! You've been added to our early access list.");
        setMessageType("success");
        setEmail(""); // Clear the input
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection and try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div>
        <Image
          src="/logo.svg"
          alt="Description"
          width={500}
          height={500}
          className="w-[90vw] mx-auto"
        />
        <form
          onSubmit={handleSubmit}
          className="bg-[#2A2d6a] text-[18px] flex w-[90%] lg:w-[700px] mx-auto  font-normal text-white h-[64px] lg:h-[78px] justify-between items-center px-3 lg:px-4 rounded-full mt-14"
        >
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent placeholder:text-white border-none text-[16px] lg:text-[18px] outline-none w-full"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#bdff00] whitespace-nowrap cursor-pointer text-[#1B1F3B] text-[16px] lg:text-[18px] font-normal px-4 h-[48px] lg:h-[54px] flex justify-center items-center rounded-full ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Get early access"}
          </button>
        </form>

        {/* Message display */}
        {message && (
          <div
            className={`text-center mt-4 text-[16px] ${messageType === "success" ? "text-[#bdff00]" : "text-red-400"
              }`}
          >
            {message}
          </div>
        )}
        <div className="flex justify-center gap-[21px] items-center mt-8 ">
          <Image
            src={"/link.svg"}
            alt="Link Icon"
            onClick={() =>
              router.push("https://www.linkedin.com/company/all-my-ai/")
            }
            width={64}
            height={64}
            className="mt-4 cursor-pointer"
          />
          <Image
            src={"/x.svg"}
            alt="Link Icon"
            width={64}
            onClick={() => router.push("https://x.com/AllMyAiofficial")}
            height={64}
            className="mt-4 cursor-pointer"
          />
          <Image
            src={"/main.svg"}
            alt="Link Icon"
            width={64}
            onClick={() => router.push("mailto:support@allmyai.ai")}
            height={64}
            className="mt-4 cursor-pointer"
          />
          <div className="flex justify-center items-center rounded-full border-gray-500 border-[1px] w-[64px] h-[64px] mt-4">
            <FiInstagram
              className="cursor-pointer text-white"
              size={32}
              onClick={() => router.push("https://www.instagram.com/allmyai/")}
            />
          </div>
        </div>
      </div>
    </div>);
};

export default page;
