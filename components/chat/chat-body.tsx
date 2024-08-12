import React, { Fragment } from 'react'
import MessageBox from './message-box'

interface ChatBodyProps{
    messages: string[]
}

const ChatBody = ({messages}: ChatBodyProps) => {
  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="flex flex-col mt-auto">
        {/* {messages?.map((group, i) => (
          <Fragment key={i}> */}
            {messages?.map((message: any, i: any) => (
              <MessageBox
                // isfirst={i === 0}
                key={i}
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