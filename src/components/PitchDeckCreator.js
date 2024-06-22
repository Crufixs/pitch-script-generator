import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import "@styles/PitchDeckCreator.css";
import UserProfile from "@public/user_icon.png";
import { GoPaperclip, GoDotFill } from "react-icons/go";
import { IoSend, IoMicOutline, IoChatbubbleEllipses } from "react-icons/io5";

export default function PitchDeckCreator(props) {
  const { setIsLoading, setLoadingProgress, setPitchDeck, sleep } = props;
  const [formAnswers, setFormAnswers] = useState({
    prompt: "",
    time: "",
    additionalInstructions: "",
  });

  async function updatePitchDeck() {
    setIsLoading(true);
    let progress = 0;

    let pitchArrPromise = handleGenerateScript();
    while (progress < 75) {
      await sleep(1000);
      progress += 25;
      setLoadingProgress(progress);
    }

    let pitchArr = await pitchArrPromise;
    setLoadingProgress(progress);

    await sleep(1000);
    setPitchDeck(pitchArr);
    setIsLoading(false);
    setLoadingProgress(0);
  }

  const handleGenerateScript = async () => {
    let { prompt, time, additionalInstructions } = formAnswers;

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, time, additionalInstructions }),
      });

      const data = await response.json();
      let parsedData = JSON.parse(data.script);
      console.log("PARSED", parsedData);

      const pitchArray = Object.keys(parsedData).map((key) => {
        return {
          title: key,
          ...parsedData[key],
        };
      });
      
      return pitchArray;
    } catch (error) {
      console.error("Error generating script:", error);
    }
    return [];
  };

  return props.width > 640 ? (
    <PitchDeckCreatorDesktop
      formAnswers={formAnswers}
      setFormAnswers={setFormAnswers}
      handleGenerateScript={updatePitchDeck}
      {...props}
    />
  ) : (
    <PitchDeckCreatorMobile
      formAnswers={formAnswers}
      setFormAnswers={setFormAnswers}
      handleGenerateScript={updatePitchDeck}
      {...props}
    />
  );
}

const PitchDeckCreatorDesktop = ({
  updatePitchDeck,
  resetPitchDeck,
  sleep,
  formAnswers,
  setFormAnswers,
  handleGenerateScript,
}) => {
  const [chats, setChats] = useState([]);

  function addChat(value, isUser) {
    setChats((e) => {
      let lastOrder = e[e.length - 1]?.chatOrder || 0;
      return [
        ...e,
        {
          chatOrder: lastOrder + 1,
          message: value,
          isUserChat: isUser,
        },
      ];
    });
  }

  useEffect(() => {
    sleep(500).then(() => {
      addChat(`What would you like to pitch about?`, false);
    });
  }, []);

  useEffect(() => {
    let lastChat = chats[chats.length - 1] || null;

    if (!lastChat || !lastChat.isUserChat) {
      return;
    }

    let botMessage = "";
    if (!formAnswers.time) {
      botMessage = `Great, what would you like your pitch length to be in minutes? The recommended length for a pitch is 3-5 minutes.`;
    } else if (!formAnswers.additionalInstructions) {
      botMessage = `Wonderful! Do you have any additional instructions or specifications on tone or structure?`;
    } else {
      handleGenerateScript();
      return;
    }

    if (botMessage)
      sleep(1500).then(() => {
        addChat(botMessage, false);
      });
  }, [formAnswers]);

  useEffect(() => {
    let lastChat = chats[chats.length - 1] || null;

    if (!lastChat?.isUserChat) {
      return;
    }

    if (!formAnswers.prompt) {
      setFormAnswers((prev) => {
        return {
          ...prev,
          prompt: lastChat.message,
        };
      });
    } else if (!formAnswers.time) {
      setFormAnswers((prev) => {
        return {
          ...prev,
          time: lastChat.message,
        };
      });
    } else if (!formAnswers.additionalInstructions) {
      setFormAnswers((prev) => {
        return {
          ...prev,
          additionalInstructions: lastChat.message,
        };
      });
    }
  }, [chats]);

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleTyping = (event) => {
    let value = event.target.value;
    if (event.key === "Enter" && value) {
      addChat(value, true);
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
        <button onClick={updatePitchDeck}>Set</button>
        <button onClick={resetPitchDeck}>Reset</button>
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
          chat.isUserChat ? (
            <div
              key={chat.chatOrder}
              className="flex w-full justify-end items-end gap-x-5 text-white"
            >
              <div className="p-3 bg-indigo-400 rounded-3xl rounded-br-none">
                <p className="px-1">{chat.message}</p>
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
                <p className="px-1">{chat.message}</p>
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
              addChat(value, true);
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
  handleGenerateScript,
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

    setFormAnswers({
      prompt,
      time,
      additionalInstructions,
    });
  }

  useEffect(() => {
    if (formAnswers.time && formAnswers.prompt) {
      handleGenerateScript();
    }
  }, [formAnswers]);

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
            className="text-center secondary-button w-12 cursor-pointer"
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
