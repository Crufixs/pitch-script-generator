import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { action, id, content, chatHistory } = await req.json();
  let response;
  try {
    switch (action) {
      case "CREATE":
        response = await createNewPitch(content, chatHistory);
        break;
      case "UPDATE":
        response = await updatePitchDeckAndChats(id, content, chatHistory);
        break;
      default:
        break;
    }

    console.log("TESTRAWR response", response);
    return NextResponse.json({ ...response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to update an existing PitchDeck and its chats
export async function updatePitchDeckAndChats(id, content, chatHistory) {
  let chatHistoryParsed = JSON.parse(chatHistory); // Parse chatHistory JSON string

  try {
    // Begin a transaction
    const updatedPitchDeck = await prisma.$transaction(async (prisma) => {
      // Update the PitchDeck
      const updatedPitchDeck = await prisma.pitchDeck.update({
        where: { id },
        data: {
          content: JSON.stringify(content), // Update content of PitchDeck
        },
      });

      // Update or create new chats
      await Promise.all(
        chatHistoryParsed.map(async (chat) => {
          if (!chat.id) {
            // If chat doesn't have an id, create a new one
            await prisma.chat.create({
              data: {
                pitchDeckId: id, // Associate chat with the updated PitchDeck
                chatContents: chat.content,
                role: chat.role,
              },
            });
          }
        })
      );

      return updatedPitchDeck;
    });

    return updatedPitchDeck;
  } catch (error) {
    console.error("Error updating PitchDeck and chats:", error);
    throw error;
  }
}

export async function createNewPitch(content, chatHistory) {
  console.log("TESTRAWR chathistory", chatHistory);
  const newPitchDeck = await prisma.pitchDeck.create({
    data: {
      content: JSON.stringify(content),
      ...(chatHistory
        ? {
            chats: {
              create: chatHistory.map((chat) => ({
                chatContents: chat.content,
                role: chat.role,
              })),
            },
          }
        : {}),
    },
    // include: {
    //   id: true,
    // },
  });

  console.log("Created new PitchDeck:", newPitchDeck);
  return newPitchDeck;
}
