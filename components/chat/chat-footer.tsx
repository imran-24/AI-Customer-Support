"use client";

import React, { useState } from "react";
import MessageInput from "./message-input";
import { HiPaperAirplane } from "react-icons/hi";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { askGemini } from "@/gemini-pro";

interface ChatFooterProps {
  setMessage: (value: any) => void;
  handleSubmit: (value: any) => void;
  value: string;
}

const ChatFooter = ({ setMessage, handleSubmit, value }: ChatFooterProps) => {
  const {
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  //   const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
  //     setIsLoading(true);
  //     try {
  //     //   setMessage((prev: string[]) => [...prev, {text: data.message, user: true}])
  //       setValue("message", "", { shouldValidate: true });
  //       const response = (await askGemini(data.message)).text()

  //     //   setMessage((prev: string[]) => [...prev, {text:response, user: false}])

  //     //   const url = qs.stringifyUrl({
  //     //     url: apiUrl,
  //     //     query,
  //     //   });
  //     //   axios.post(url, data);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  return (
    <div
      className="
    z-50
    px-4
    py-3
    border-t
    border-gray-200
    bg-white
    "
    >
      <div className="flex items-center space-x-4">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 lg-gap-4 w-full"
        >
          {/* <MessageInput
            errors={errors}
            id="message"
            register={register}
            placeholder="Write a message..."
            required
            type="text"
          /> */}
          <div className="relative w-full">
            <input
                type={"text"}
                onChange={setMessage}
                placeholder={"Write a message..."}
                value={value}
                className="
                text-black
                font-light
                py-2
                px-4
                bg-neutral-100 
                w-full 
                rounded-full
                focus:outline-none
                "
            />
          </div>
          <button
            className=" rounded-full  p-2  bg-sky-500 hover:bg-sky-600  transition cursor-pointer"
            type="submit"
          >
            <HiPaperAirplane size={18} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatFooter;
