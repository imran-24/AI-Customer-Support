"use client";

import React from "react";
import ChatBody from "./chat-body";
import ChatFooter from "./chat-footer";

import { useChat } from "ai/react"

const ChatClient = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/chat",
    onError: (e: any) => {
      console.log(e);
    },
  });
  return (
    <div
      className="
        md:block 
        w-full
        h-full
        "
    >
      <div className="flex flex-col min-h-full max-w-5xl mx-auto space-y-4">
        {/* <ChatHeader 
                conversation={conversation}/> */}
        {/* <ChatBody messages={messages} />
        <ChatFooter setMessage={handleInputChange} handleSubmit={handleSubmit} value={input}   /> */}
      </div>
    </div>
  );
};

export default ChatClient;
