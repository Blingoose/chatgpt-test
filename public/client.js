const inputField = document.getElementById("inputField");
const submitButton = document.getElementById("submitButton");
const outputDiv = document.getElementById("output");

let conversationHistory = [];

function updateConversationHistory(sender, message) {
  conversationHistory.push({ sender, message });
}

async function sendMessage(message) {
  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversationHistory: JSON.stringify(conversationHistory),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch chat response");
    }

    const data = await response.json();
    const chatResponse = data.chatResponse.trim(); // Extract chatResponse from data
    updateConversationHistory("system", chatResponse);
    return chatResponse;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Rethrow the error for handling elsewhere
  }
}

async function submitUserMessage(event) {
  if (event.key === "Enter" || event.type === "click") {
    const userMessage = inputField.value.trim();
    if (userMessage !== "") {
      try {
        updateConversationHistory("user", userMessage);
        const chatResponse = await sendMessage(userMessage);

        inputField.value = "";
        outputDiv.innerHTML += `<p><span class="you"><strong>You:</strong></span> ${userMessage}</p>`;
        outputDiv.innerHTML += `<p><span class="trump"><strong>Donald J. Trump:</strong></span> ${chatResponse}</p>`;
        outputDiv.scrollTop = outputDiv.scrollHeight;
      } catch (error) {
        // Handle error
        console.error("Error getting chat response:", error);
      }
    }
  }
}

inputField.addEventListener("keypress", submitUserMessage);
submitButton.addEventListener("click", submitUserMessage);
