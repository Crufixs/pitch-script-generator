import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import "@styles/PitchDeckCreator.css";
import UserProfile from "@public/user_icon.png";
import { GoPaperclip, GoDotFill } from "react-icons/go";
import { IoSend, IoMicOutline, IoChatbubbleEllipses } from "react-icons/io5";
import { chatOpenAi, generatePitchDeck } from "@lib/fetch";

export default function PitchDeckCreator(props) {
  const { setIsLoading, setLoadingProgress, sleep, setPitchDeck } = props;
  const [formAnswers, setFormAnswers] = useState({
    prompt: "",
    time: "",
    additionalInstructions: "",
  });

  async function updatePitchDeck(pitchArr) {
    setIsLoading(true);
    let progress = 0;

    // let pitchArrPromise = handleGenerateScript();
    while (progress < 100) {
      await sleep(1000);
      progress += 25;
      setLoadingProgress(progress);
    }

    setPitchDeck(pitchArr);
    setIsLoading(false);
    setLoadingProgress(0);
  }

  return props.width > 640 ? (
    <PitchDeckCreatorDesktop
      formAnswers={formAnswers}
      setFormAnswers={setFormAnswers}
      updatePitchDeck={updatePitchDeck}
      {...props}
    />
  ) : (
    <PitchDeckCreatorMobile
      formAnswers={formAnswers}
      setFormAnswers={setFormAnswers}
      updatePitchDeck={updatePitchDeck}
      {...props}
    />
  );
}
const Role = Object.freeze({
  USER: "user",
  ASSISTANT: "assistant",
});

const PitchDeckCreatorDesktop = ({
  updatePitchDeck,
  sleep,
  chats,
  setChats,
}) => {
  const handleChat = async (message) => {
    let currChat = [...chats];
    addChat(message, Role.USER);

    try {
      const { script, responseMessage } = await chatOpenAi(message, currChat);

      if (responseMessage) {
        addChat(responseMessage, Role.ASSISTANT);
      }

      if (script) {
        let parsedData = JSON.parse(script);

        const pitchArray = Object.keys(parsedData).map((key) => {
          return {
            title: key,
            ...parsedData[key],
          };
        });
        updatePitchDeck(pitchArray);
      }
    } catch (error) {
      console.error("Error generating script:", error);
    }
  };

  function addChat(content, role) {
    setChats((e) => {
      let lastOrder = e[e.length - 1]?.chatOrder || 0;
      return [
        ...e,
        {
          chatOrder: lastOrder + 1,
          content,
          role,
        },
      ];
    });
  }

  useEffect(() => {
    if (!chats || chats.length === 0) {
      sleep(500).then(() => {
        addChat(`What would you like to pitch about?`, Role.ASSISTANT);
      });
    }
  }, []);

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleTyping = (event) => {
    let value = event.target.value;
    if (event.key === "Enter" && value) {
      handleChat(value);
      setInputValue("");
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    } else {
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full py-5 flex flex-col h-full overflow-y-auto">
      <div className="flex pb-5 px-5 items-start gap-x-5 border-b">
        <div className="p-7 rounded-full bg-gray-200"></div>
        <div className="flex flex-col">
          <p className="font-geologica text-xl">Fornax</p>
          <p className="text-lg">Pitch Deck Creator</p>
        </div>
      </div>
      <div className="p-5 gap-y-5 flex flex-col-reverse grow overflow-y-auto">
        {isTyping && (
          <div className="flex w-full justify-end items-end gap-x-5 text-white">
            <div className="p-3 bg-indigo-400 rounded-3xl rounded-br-none">
              <p className="px-1 flex">
                <GoDotFill className="my-1" />
                <GoDotFill className="my-1" />
                <GoDotFill className="my-1" />
              </p>
            </div>
            <Image
              src={UserProfile}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover bg-indigo-400 shrink-0"
            />
          </div>
        )}
        {[...chats].reverse().map((chat) =>
          chat.role === Role.USER ? (
            <div
              key={chat.chatOrder}
              className="flex w-full justify-end items-end gap-x-5 text-white"
            >
              <div className="p-3 bg-indigo-400 rounded-3xl rounded-br-none">
                <p className="px-1">{chat.content}</p>
              </div>
              <Image
                src={UserProfile}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover bg-indigo-400 shrink-0"
              />
            </div>
          ) : (
            <div
              key={chat.chatOrder}
              className="flex w-full justify-start items-end gap-x-5"
            >
              <div className="flex relative bg-indigo-50 w-10 h-10 rounded-full shrink-0">
                <IoChatbubbleEllipses className="text-indigo-400 w-5 h-5 m-auto" />
              </div>
              <div className="p-3 bg-indigo-50 rounded-3xl rounded-bl-none">
                <p className="px-1">{chat.content}</p>
              </div>
            </div>
          )
        )}
      </div>
      <div className="mx-5 p-2 rounded-full flex gap-x-2 chatBoxContainer">
        <div className="rounded-full p-2 cursor-pointer	">
          <GoPaperclip className="text-indigo-400 w-6 h-6" />
        </div>
        <input
          className="w-full border-0"
          type="text"
          placeholder="Message Fornax pitch script generator assistant"
          onKeyDown={handleTyping}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        {inputValue ? (
          <div
            className="rounded-full p-2 border border-indigo-400 cursor-pointer"
            onClick={() => {
              handleChat(value);
              setInputValue("");
            }}
          >
            <IoSend className="w-5 h-5 m-0.5 text-indigo-400" />
          </div>
        ) : (
          <div className="rounded-full p-2 border border-gray-200">
            <IoSend className="w-5 h-5 m-0.5 text-gray-200" />
          </div>
        )}

        <div className="rounded-full p-2 border border-indigo-400 cursor-pointer">
          <IoMicOutline className="text-indigo-400 w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const PitchDeckCreatorMobile = ({
  formAnswers,
  setFormAnswers,
  updatePitchDeck,
  chats,
  setChats,
  setShowGeneratedPitchScript,
}) => {
  const [prompt, setPrompt] = useState("");
  const [time, setTime] = useState(0);
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  function handleSubmit() {
    if (!prompt) {
      window.alert(
        "Please input the description of what your pitch script should look like"
      );
      return;
    }
    if (!time) {
      window.alert("Please input a valid pitch length");
      return;
    }

    setChats([
      {
        chatOrder: 0,
        content: "What would you like to pitch about?",
        role: Role.ASSISTANT,
      },
      {
        chatOrder: 1,
        content: prompt,
        role: Role.USER,
      },
      {
        chatOrder: 2,
        content: "Input your pitch length in minutes",
        role: Role.ASSISTANT,
      },
      {
        chatOrder: 3,
        content: `${time} minutes`,
        role: Role.USER,
      },
      ...(additionalInstructions
        ? [
            {
              chatOrder: 4,
              content: "Input additional instructions or specifications",
              role: Role.ASSISTANT,
            },
            {
              chatOrder: 5,
              content: additionalInstructions,
              role: Role.USER,
            },
          ]
        : []),
    ]);
    handleGeneratePitchDeck();
  }

  const handleGeneratePitchDeck = async () => {
    let currChat = [...chats];
    let chatHistory = currChat.map((chat) => {
      return { role: chat.role.toString(), content: chat.content };
    });

    try {
      const { script } = await generatePitchDeck(currChat);

      if (script) {
        let parsedData = JSON.parse(script);

        const pitchArray = Object.keys(parsedData).map((key) => {
          return {
            title: key,
            ...parsedData[key],
          };
        });
        updatePitchDeck(pitchArray);
        setShowGeneratedPitchScript(true);
      }
    } catch (error) {
      console.error("Error generating script:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-2">
        <p>What would you like to pitch about?</p>
        <textarea
          className="w-full h-40"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Fornax AI to generate a pitch script based on your prompt"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <p>Or upload a pitch deck (Accepts PDF files up to 10MB)</p>
        <div className="flex gap-x-2">
          <input
            className="grow p-2"
            type="text"
            placeholder="Fornax Pitch V1.pdf"
            readOnly
          />
          <button className="p-2 primary-button">
            <span>Upload File</span>
          </button>
        </div>
      </div>
      <div className="flex gap-x-2 items-center justify-between">
        <p>
          Pitch length in minutes <br />
          (Recommended 3-5)
        </p>
        <div className="flex gap-x-2 h-full">
          <button
            className="p-2 px-4 secondary-button"
            onClick={() => setTime((time) => (time > 0 ? time - 1 : time))}
          >
            <span>-</span>
          </button>
          <input
            type="text"
            value={time}
            className="text-center w-12"
            readOnly
          ></input>
          <button
            className="p-2 px-4 secondary-button"
            onClick={() => setTime((time) => time + 1)}
          >
            <span>+</span>
          </button>
        </div>
      </div>
      <div>
        <p>Additional instructions or specifications</p>
        <textarea
          placeholder="Enter your preferences on tone or structure"
          className="w-full h-20"
          onChange={(e) => setAdditionalInstructions(e.target.value)}
        />
      </div>
      <button
        className="primary-button w-full p-5 text-xl"
        onClick={() => handleSubmit()}
      >
        <span>Generate Pitch Script</span>
      </button>
    </div>
  );
};
