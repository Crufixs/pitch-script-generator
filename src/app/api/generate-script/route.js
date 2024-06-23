// src/app/api/generate-script/route.js
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message, chatHistory, action } = await req.json();
  let script;
  console.log("chatHistory", chatHistory);
  console.log("message", message);
  console.log("action", action);

  try {
    // const promptMessage = `Generate a pitch script about: ${prompt}. Each section should not be longer than ${time} minutes. Additional Instructions include: ${additionalInstructions}.`;

    // const promptMessage =
    //   "Can you help me with making a pitch script about dinosaurs, make sure its total amount is 5 mintues long";
    const tools = [
      {
        type: "function",
        function: {
          name: "get_presentation",
          description: "Make the presentation sections of the pitch script ",
          parameters: {
            type: "object",
            properties: {
              ["Introduction"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "A brief overview of who you are and what you're pitching",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Introduction section should take",
                  },
                },
              },
              ["Hook"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "A compelling opening statement designed to grab the audience's attention",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Hook section should take",
                  },
                },
              },
              ["Problem Statement"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "A clear description of the issue or need your product/service addresses",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Problem Statement section should take",
                  },
                },
              },
              ["Solution"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "An explanation of how your product/service solves the problem",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Solution section should take",
                  },
                },
              },
              ["Market Opportunity"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Insights into the market size, target audience, and demand for your solution",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Market Opportunity section should take",
                  },
                },
              },
              ["Business Model"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "An outline of how your business will make money",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Business Model section should take",
                  },
                },
              },
              ["Traction"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Evidence of your progress and success so far, such as user numbers, sales, or partnerships.",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Traction section should take",
                  },
                },
              },
              ["Go-to-Market Strategy"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Your plan for reaching and acquiring customers",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Go-to-Market Strategy section should take",
                  },
                },
              },
              ["Team"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Introductions to the key members of your team and their relevant expertise",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Team section should take",
                  },
                },
              },
              ["Financials and Projections"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Current financial status and future financial projections over a specific period.",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Financials and Projections section should take",
                  },
                },
              },
              ["Closing"]: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description:
                      "Conclusion of the pitch with a compelling statement or call to action, typically aiming to secure investment or partnership.",
                  },
                  time: {
                    type: "integer",
                    description:
                      "Amount of seconds the Closing section should take",
                  },
                },
              },
            },
            required: [
              "Hook",
              "Introduction",
              "Problem Statement",
              "Solution",
              "Market Opportunity",
              "Business Model",
              "Traction",
              "Go-to-Market Strategy",
              "Team",
              "Financials and Projections",
              "Closing",
            ],
          },
        },
      },
    ];

    let messages = [];
    let tool_choice;
    switch (action) {
      case "CHAT":
        messages = [
          {
            role: "system",
            content:
              "You are an assistant that helps generate pitch scripts for various " +
              "purposes, such as business presentations, product pitches, and investor " +
              "meetings. Before creating a pitch script, you need to first ask " +
              "descriptions on what the pitch script is about and then what is the total " +
              "time the pitch should take. Then ask them if they have any additional instructions",
          },
          ...chatHistory,
          {
            role: "user",
            content: message,
          },
        ];
        tool_choice = "auto";
        break;
      case "GENERATE":
        messages = [...chatHistory];
        tool_choice = "required";
        break;
      default:
        break;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      tools,
      tool_choice,
      // max_tokens: 1500,
    });

    console.log("response", response);

    let responseMessage = response.choices[0].message;
    console.log("responseMessage", responseMessage);
    if (responseMessage.tool_calls) {
      let toolCalls = responseMessage.tool_calls;

      let functionResponses = toolCalls.map((toolCall) => {
        let args = toolCall.function.arguments;
        return JSON.parse(args);
      });

      script = JSON.stringify(functionResponses[0]);
    }

    return NextResponse.json({
      script,
      responseMessage: responseMessage.content,
    });
  } catch (error) {
    console.log("Testrawr error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
