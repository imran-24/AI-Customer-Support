"use client";

import React, { useEffect, useRef } from "react";
import ChatBody from "./chat-body";
import ChatFooter from "./chat-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useChat } from "ai/react";

const ChatClient = () => {
  const chatParent = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/conversation",
    onError: (e: any) => {
      console.log(e);
    },
  });

  useEffect(() => {
    const domNode = chatParent.current
    if (domNode) {
        domNode.scrollTop = domNode.scrollHeight
    }
})


  return (
    <Card className="h-full max-w-3xl flex flex-col mx-auto relative">
      {/* <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader> */}
      <CardContent ref={chatParent}  className="flex-1 overflow-y-auto mb-6 ">
        <ChatBody messages={messages} />
      </CardContent>
      <CardFooter className="w-full absolute bottom-0 left-0 right-0">
        <ChatFooter
          setMessage={handleInputChange}
          handleSubmit={handleSubmit}
          value={input}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatClient;
