import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiCircleAlert } from "react-icons/ci";
const CustomInput = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="mb-4 relative">
      <label className="flex  text-[#2A0856]  text-[12px]  mr-auto font-medium mb-1">
        {label} <span className="text-red-500 ">*</span>
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-[20px] pr-[16px] py-[16px] border rounded-lg text-[12px]  focus:outline-none transition duration-200 ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-400"
              : "border-gray-300 focus:ring-2 focus:ring-[#C209C1]"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 flex gap-1 text-sm mt-1">
          <CiCircleAlert className="text-xl" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomInput;
