import Home from "@/app/page.js";
import prisma from "@lib/prisma";

const Role = Object.freeze({
  USER: "user",
  ASSISTANT: "assistant",
});

export default async function Page({ params }) {
  let { id } = params;

  let pitchData = await getPitchDeck(id);

  async function getPitchDeck(id) {
    const pitchDeck = await prisma.pitchDeck.findUnique({
      where: {
        id: String(id), // Convert id to string if it's not already
      },
      include: {
        chats: true, // Include the chats relation
      },
    });

    return pitchDeck;
  }

  let sortedChat = pitchData.chats.sort((a, b) => {
    return new Date(a.dateReceived) - new Date(b.dateReceived);
  });

  let loadedPitchData = JSON.parse(pitchData.content);
  let loadedChatData = sortedChat.map((chat, index) => {
    return {
      id: chat.id,
      chatOrder: index,
      role: chat.role === "user" ? Role.USER : Role.ASSISTANT,
      content: chat.chatContents,
    };
  });

  return (
    <Home
      pitchId={id}
      loadedPitchData={loadedPitchData}
      loadedChatData={loadedChatData}
    />
  );
}
