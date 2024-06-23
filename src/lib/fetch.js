// Formats chat for database
function convertChatHistory(chats) {
  return chats.map((chat) => {
    return {
      role: chat.role.toString(),
      content: chat.content,
      ...(chat.id ? { id: chat.id } : {}),
    };
  });
}

export async function createData(pitchDeck, chats) {
  const chatHistory = convertChatHistory(chats);

  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: pitchDeck,
      chatHistory,
      action: "CREATE",
    }),
  });

  return response.json();
}

export async function saveData(pitchDeck, chats) {
  const chatHistory = convertChatHistory(chats);

  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: pitchDeck,
      chatHistory,
      action: "CREATE",
    }),
  });

  return response.json();
}

export async function updateData(id, pitchDeck, chats) {
  const chatHistory = convertChatHistory(chats);

  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      content: pitchDeck,
      chatHistory,
      action: "UPDATE",
    }),
  });

  return response.json();
}

export async function chatOpenAi(message, chats) {
  const chatHistory = convertChatHistory(chats);

  const response = await fetch("/api/generate-script", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, chatHistory, action: "CHAT" }),
  });

  return response.json();
}

export async function generatePitchDeck(chats) {
  const chatHistory = convertChatHistory(chats);

  const response = await fetch("/api/generate-script", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatHistory, action: "GENERATE" }),
  });

  return response.json();
}
