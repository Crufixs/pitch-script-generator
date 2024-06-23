"use client";
import { useState, useEffect, useRef, useContext } from "react";
import GeneratedPitchScript from "@components/GeneratedPitchScript";
import PitchDeckCreator from "@components/PitchDeckCreator";
import HeaderAndFooter from "@/components/HeaderAndFooter";
import ProgressBar from "@components/ProgressBar";
import ScreenDimensionsContext from "@lib/ScreenDimensionsContext";

export default function Home({ pitchId, loadedPitchData, loadedChatData }) {
  const { width, height } = useContext(ScreenDimensionsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);
  const [pitchDeck, setPitchDeck] = useState(
    loadedPitchData
      ? loadedPitchData
      : [
          {
            title: "Introduction",
            content: null,
            time: null,
          },
          {
            title: "Hook",
            content: null,
            time: null,
          },
          {
            title: "Problem Statement",
            content: null,
            time: null,
          },
          {
            title: "Solution",
            content: null,
            time: null,
          },
          {
            title: "Market Opportunity",
            content: null,
            time: null,
          },
          {
            title: "Business Model",
            content: null,
            time: null,
          },
          {
            title: "Traction",
            content: null,
            time: null,
          },
          {
            title: "Go-to-Market Strategy",
            content: null,
            time: null,
          },
          {
            title: "Team",
            content: null,
            time: null,
          },
          {
            title: "Financials and Projections",
            content: null,
            time: null,
          },
          {
            title: "Closing",
            content: null,
            time: null,
          },
        ]
  );
  const [chats, setChats] = useState(loadedChatData ? loadedChatData : []);
  // Mobile State

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  function convertToMarkdown(slides) {
    return slides
      .map((slide) => {
        let markdown = "";
        if (slide.title) {
          markdown += `## ${slide.title}\n\n`;
        }
        if (slide.content) {
          markdown += `${slide.content}\n\n`;
        }
        if (slide.time) {
          markdown += `*Time: ${slide.time} seconds*\n\n`;
        }
        return markdown;
      })
      .join("\n");
  }

  const GeneratedPitchScriptProps = {
    isLoading,
    loadingProgress,
    pitchDeck,
    width,
    pitchId,
    convertToMarkdown,
  };

  const PitchDeckCreatorProps = {
    setPitchDeck,
    isLoading,
    setIsLoading,
    loadingProgress,
    setLoadingProgress,
    width,
    sleep,
    chats,
    setChats,
    pitchId,
    disableButtons,
    setDisableButtons,
  };

  const HeaderAndFooterProps = {
    pitchDeck,
    chats,
    width,
    pitchId,
    isLoading,
    setIsLoading,
    disableButtons,
    setDisableButtons,
    convertToMarkdown,
  };

  return (
    <main className="h-screen w-screen flex flex-col">
      {width === null ? (
        <div className="m-auto flex items-center justify-center">
          <p className="text-5xl font-medium">Loading...</p>
        </div>
      ) : width > 640 ? (
        <DesktopHome
          GeneratedPitchScriptProps={GeneratedPitchScriptProps}
          PitchDeckCreatorProps={PitchDeckCreatorProps}
          HeaderAndFooterProps={HeaderAndFooterProps}
          isLoading={isLoading}
          loadingProgress={loadingProgress}
        />
      ) : (
        <MobileHome
          GeneratedPitchScriptProps={GeneratedPitchScriptProps}
          PitchDeckCreatorProps={PitchDeckCreatorProps}
          HeaderAndFooterProps={HeaderAndFooterProps}
          isLoading={isLoading}
          loadingProgress={loadingProgress}
        />
      )}
    </main>
  );
}

const DesktopHome = ({
  GeneratedPitchScriptProps,
  PitchDeckCreatorProps,
  HeaderAndFooterProps,
  isLoading,
  loadingProgress,
}) => {
  return (
    <>
      <HeaderAndFooter {...HeaderAndFooterProps}>
        <div className="grid sm:grid-cols-2 flex-grow overflow-y-auto">
          <div className="relative overflow-y-auto">
            <GeneratedPitchScript {...GeneratedPitchScriptProps} />
            {isLoading && (
              <div className="flex absolute left-0 top-0 blur-background w-full h-full">
                <div className="m-auto px-8 sm:px-16 flex flex-col items-center">
                  <p className="px-10 text-center font-geologica text-xl">
                    Generating your pitch script. This may take a few seconds.
                  </p>
                  <ProgressBar percentage={loadingProgress} />
                </div>
              </div>
            )}
          </div>
          <PitchDeckCreator {...PitchDeckCreatorProps} />
        </div>
      </HeaderAndFooter>
    </>
  );
};

const MobileHome = ({
  GeneratedPitchScriptProps,
  PitchDeckCreatorProps,
  HeaderAndFooterProps,
  isLoading,
  loadingProgress,
}) => {
  const [showGeneratedPitchScript, setShowGeneratedPitchScript] =
    useState(false);

  const cancelledRef = useRef(null);
  return (
    <div className="pitch-deck-background">
      <HeaderAndFooter
        {...HeaderAndFooterProps}
        setShowGeneratedPitchScript={setShowGeneratedPitchScript}
        showGeneratedPitchScript={showGeneratedPitchScript}
        cancelledRef={cancelledRef}
      >
        <div className="relative">
          {showGeneratedPitchScript ? (
            <GeneratedPitchScript
              {...GeneratedPitchScriptProps}
              setShowGeneratedPitchScript={setShowGeneratedPitchScript}
            />
          ) : (
            <PitchDeckCreator
              {...PitchDeckCreatorProps}
              cancelledRef={cancelledRef}
              setShowGeneratedPitchScript={setShowGeneratedPitchScript}
              showGeneratedPitchScript={showGeneratedPitchScript}
            />
          )}
          {isLoading && (
            <div className="flex absolute left-0 top-0 bottom-0 right-0 bg-white">
              <div className="m-auto px-8 sm:px-16 flex flex-col items-center">
                <p className="px-10 text-center text-base">
                  Generating your pitch script. <br />
                  This may take a few seconds.
                </p>
                <ProgressBar percentage={loadingProgress} />
              </div>
            </div>
          )}{" "}
        </div>
      </HeaderAndFooter>
    </div>
  );
};

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <code className="font-mono font-bold">src/app/page.js</code>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{" "}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Docs{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Learn{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Templates{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Explore starter templates for Next.js.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Deploy{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   );
// }
