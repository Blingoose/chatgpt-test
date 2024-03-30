require("dotenv").config();

exports.handler = async function (event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const { message, conversationHistory } = requestBody;

    const messages = [
      {
        role: "system",
        content: "You are ChatGPT",
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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 250,
        messages: messages,
      }),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch chat response" }),
      };
    }

    const data = await response.json();
    const chatResponse = data.choices[0].message.content.trim();

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
