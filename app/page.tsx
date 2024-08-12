'use client';

import ChatBody from "@/components/chat/chat-body";
import ChatFooter from "@/components/chat/chat-footer";
import { askGemini } from "@/gemini-pro";
import { useState } from "react";

export default  function Home() {
  // const response = await askGemini();  // Await the function call directly

  const [messages, setMessage] = useState([]);

  // console.log(response);  // Log the response

  return (
    <div className="
        md:block 
        w-full
        h-full">
            <div className="flex flex-col h-full">
                {/* <ChatHeader 
                conversation={conversation}/> */}
                <ChatBody
                messages={messages} 
                // chatId={conversation.id}
                // apiUrl={'/api/messages'}
                // sockeyUrl={'/api/socket/messages'}
                // socketQuery={{ 
                //     conversationId: conversation.id,
                //     memberId: currentUser.id
                // }}
                // paramKey="conversationId"
                // paramValue={conversation.id}
                /> 
                <ChatFooter
                setMessage={(value: any) => setMessage(value)}
                // apiUrl={"/api/socket/messages"}
                // query={{ 
                //     conversationId: conversation.id,
                //     memberId: currentUser.id
                //  }}
                /> 
            </div>
        </div>
  );
}
