import React, { Fragment } from 'react'
import MessageBox from './message-box'
import { Message } from 'ai/react'

interface ChatBodyProps{
    messages: Message[]
}

const ChatBody = ({messages}: ChatBodyProps) => {
  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto min-h-full ">
        <div className="flex flex-col mt-auto">
        {/* {messages?.map((group, i) => (
          <Fragment key={i}> */}
            {messages?.map((message) => (
              <MessageBox
                // isfirst={i === 0}
                key={message.id}
                message={message}

              />
            ))}
          {/* </Fragment>
        ))} */}
      </div>
    </div>
  )
}

export default ChatBody