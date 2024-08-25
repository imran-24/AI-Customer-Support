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
import Image from "next/image";

const ChatClient = () => {
  const chatParent = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/conversation",
    onError: (e: any) => {
      console.log(e);
    },
  });

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  return (
    <Card className="h-full max-w-xl flex flex-col mx-auto relative border-none ">
      
      <CardHeader className=" lg:fixed lg:left-0  bg-white z-10">
        <CardTitle>IUB GreenBook 2023 </CardTitle>
        <CardDescription>Independent university, Bangladesh</CardDescription>
      </CardHeader>
      <CardContent ref={chatParent} className="flex-1 overflow-y-auto  mb-6 ">
        <ChatBody messages={messages} />
        {messages.length === 0 && (
          <div className="absolute bottom-20 space-y-2">
            <div className=" p-2  w-fit  border border-neutral-300  rounded-lg bg-neutral-100">
              <p className="text-sm text-neutral-800 font-medium ">
                Independent University, Bangladesh
              </p>
            </div>
            <div className=" p-2 w-fit border border-neutral-300  rounded-lg bg-neutral-100">
              <p className="text-sm text-neutral-800">
                Ask anything about{" "}
                <span className="font-medium capitalize text-black">
                  Iub Policies And Procedures
                </span>
              </p>
            </div>
          </div>
        )}
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
