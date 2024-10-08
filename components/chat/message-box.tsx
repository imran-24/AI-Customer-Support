"use client";

import { cn } from "@/app/lib/utils";
import { Message } from "ai";
import React from "react";
import Avater from "../ui/avater";

interface MessageBoxProps {
  message: Message;
}

const MessageBox = ({ message }: MessageBoxProps) => {
  const isOwn = message.role === "user";

  const container = cn(
    `
    relative
    transition
    w-full
    flex 
    gap-2 
    pb-4`,
    isOwn && "justify-end"
  );

  
  const avater = cn(isOwn && "order-2");
  const body = cn("flex flex-col gap-2", isOwn && "items-end");

  const content = cn(
    "w-fit overflow-hidden rounded-md p-2",
    isOwn ? "text-white bg-sky-500" : "text-gray-100 bg-gray-400/90"
  );

  return (
    <div className={container}>
      <div className={avater}>
        <Avater src={isOwn ?  '/user-placeholder.png' : "/logo.svg" } />
      </div>
      <div className={body}>
        <div className="flex items-center gap-2">
          {/* <div className="text-sm text-gray-500">{message.sender.name}</div> */}
          {/* <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div> */}
        </div>
        <div className={content}>
          <div>{message?.content}</div>
        </div>
        {/* {isfirst && isOwn && seenList.length > 0 && (
          <div className="text-xs text-gray-400 font-light">
            {`seen by ${seenList}`}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MessageBox;
