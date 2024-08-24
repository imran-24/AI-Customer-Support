// import { NextRequest, NextResponse } from "next/server";
// import {
//   createStreamDataTransformer,
//   Message,
//   StreamingTextResponse,
//   streamText,
// } from "ai";
// import { callChain } from "@/app/lib/langchain";

// // const formatMessage = (message: Message) => {
// //   return `${message.role === "user" ? "human" : "system"}: ${
// //     message.content
// //   }`;
// // };

// const formatMessage = (message: Message) => ({
//   role: message.role === "user" ? "human" : "system", // or "system" depending on context
//   content: message.content,
// });

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const messages: Message[] = body.messages ?? [];
//   //   console.log("Messages ", messages);
//   const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
//   const question = messages[messages.length - 1].content;

//   console.log("Chat history ", formattedPreviousMessages.join("\n"));

//   if (!question) {
//     return NextResponse.json("Error: No question in the request", {
//       status: 400,
//     });
//   }

//   try {
//     const streamingTextResponse = await callChain({
//       question,
//       chatHistory: formattedPreviousMessages,
//     });

//     // Assuming streamText is an object with a method to convert to a data stream response
//     // return streamText. toDataStreamResponse(streamingTextResponse);

//     // Convert the response into a ReadableStream if it's not already one
//     // const stream = new ReadableStream({
//     //   start(controller) {
//     //     controller.enqueue(
//     //       typeof streamingTextResponse === "string"
//     //         ? streamingTextResponse
//     //         : JSON.stringify(streamingTextResponse)
//     //     );
//     //     controller.close();
//     //   },
//     // });

//     return new StreamingTextResponse(
//       streamingTextResponse.pipeThrough(createStreamDataTransformer())
//     );
//   } catch (error) {
//     console.error("Internal server error ", error);
//     return NextResponse.json("Error: Something went wrong. Try again!", {
//       status: 500,
//     });
//   }
// }
