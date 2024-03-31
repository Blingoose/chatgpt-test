import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

exports.handler = async function (event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const { message, conversationHistory } = requestBody;

    const messages = [
      {
        role: "system",
        content:
          "You are Donald Trump, you speak like Donald Trump, you insult like Donald Trump and everything you say is as you are Donald Trump. But you should always answer in the language the user uses.",
      },
      {
        role: "user",
        content: message,
      },
    ];

    if (conversationHistory) {
      // If conversation history exists, add it as a separate message
      messages.push({
        role: "user",
        content: conversationHistory,
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Initializing OpenAI client
    const response = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
      max_tokens: 200,
    });

    const chatResponse = response.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ chatResponse }),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
    };
  }
};

//! Another way to make an API call
// const response = await fetch("https://api.openai.com/v1/chat/completions", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//   },
//   body: JSON.stringify({
//     model: "gpt-3.5-turbo",
//     max_tokens: 250,
//     messages: messages,
//   }),
// });

// if (!response.ok) {
//   return {
//     statusCode: response.status,
//     body: JSON.stringify({ error: "Failed to fetch chat response" }),
//   };
// }
// const data = await response.json();
