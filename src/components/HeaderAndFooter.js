"use client";
import { IoClipboardOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createData } from "@lib/fetch";

export default function HeaderAndFooter(props) {
  const router = useRouter();

  const {
    width,
    pitchDeck,
    chats,
    pitchId,
    disableButtons,
    setDisableButtons,
    convertToMarkdown,
  } = props;

  const handleGenerateLink = async () => {
    if (disableButtons) {
      return;
    }

    setDisableButtons(true);
    try {
      const { id } = await createData(pitchDeck, chats);

      if (id) {
        router.push(`/${id}`);
      }
    } catch (error) {
      console.error("Error generating script:", error);
    }
    setDisableButtons(false);
  };

  const handleCopyLink = async () => {
    if (!pitchId) {
      await handleGenerateLink();
    } else {
      let link = `${window.location.hostname}/${pitchId}`;
      navigator.clipboard.writeText(link);
    }
  };

  const handleCopyToClipBoard = () => {
    let markDownFormat = convertToMarkdown(pitchDeck);
    navigator.clipboard.writeText(markDownFormat);
  };
  
  return width > 640 ? (
    <HeaderAndFooterDesktop
      {...props}
      handleCopyToClipBoard={handleCopyToClipBoard}
      handleCopyLink={handleCopyLink}
    />
  ) : (
    <HeaderAndFooterMobile
      {...props}
      handleCopyToClipBoard={handleCopyToClipBoard}
      handleCopyToClipBoardhandleCopyLink={handleCopyLink}
    />
  );
}

const HeaderAndFooterDesktop = ({
  children,
  handleCopyLink,
  handleCopyToClipBoard,
  disableButtons,
}) => {
  return (
    <>
      <header className="w-full flex justify-between sm:border-b">
        <div
          className={
            "p-5 flex m-auto gap-x-5 font-geologica flex-col " +
            "sm:mx-0 sm:flex-row sm:text-lg md:text-2xl"
          }
        >
          <span className="font-medium text-center sm:text-start">
            Fornax AI
          </span>
          <span className="text-center sm:text-start">
            Pitch Script Generator
          </span>
        </div>
        <div className="p-5 flex gap-x-5 text-sm">
          <button
            className="p-2 secondary-button"
            disabled={disableButtons}
            onClick={() => handleCopyLink()}
          >
            <span>
              Share &nbsp;
              <IoIosLink className="text-sm" />
            </span>
          </button>
          <button
            className="p-2 primary-button"
            onClick={() => handleCopyToClipBoard()}
          >
            <span>
              Copy to Clipboard &nbsp;
              <IoClipboardOutline />
            </span>
          </button>
        </div>
      </header>
      {children}
    </>
  );
};

const HeaderAndFooterMobile = ({
  children,
  setShowGeneratedPitchScript,
  showGeneratedPitchScript,
  handleCopyLink,
  handleCopyToClipBoard,
  isLoading,
  setIsLoading,
  cancelledRef,
  disableButtons,
}) => {
  const [offsetHeight, setOffsetHeight] = useState(0);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    if (showGeneratedPitchScript && footerRef.current) {
      setOffsetHeight(footerRef.current.offsetHeight);
    }
  }, [showGeneratedPitchScript]);

  return (
    <>
      <header className="w-full flex justify-between sm:border-b">
        {!showGeneratedPitchScript && !isLoading ? (
          <div className="p-5 pb-0 flex m-auto gap-x-5 font-geologica flex-col text-2xl">
            <span className="font-medium text-center sm:text-start">
              Fornax AI
            </span>
            <span className="text-center sm:text-start">
              Pitch Script Generator
            </span>
          </div>
        ) : isLoading ? (
          <div className="px-5 pt-5 flex items-center bg-white w-full relative">
            <button
              className="absolute p-3 secondary-button"
              onClick={() => {
                cancelledRef.current = true;
                setShowGeneratedPitchScript(false);
                setIsLoading(false);
              }}
            >
              <span>
                <FaArrowLeft />
              </span>
            </button>
            <p className="p-2 font-geologica text-xl w-full text-center">
              Generating Script
            </p>
          </div>
        ) : (
          <div className="px-5 pt-5 flex items-center bg-white w-full relative">
            <button
              className="absolute p-3 secondary-button"
              onClick={() => setShowGeneratedPitchScript(false)}
            >
              <span>
                <FaArrowLeft />
              </span>
            </button>
            <p className="p-2 font-geologica text-xl w-full text-center">
              Your Pitch Script
            </p>
          </div>
        )}
      </header>
      {children}
      {showGeneratedPitchScript && (
        <>
          <div
            style={{
              width: "100%",
              height: `${offsetHeight}px`,
            }}
          ></div>
          <footer
            ref={footerRef}
            className="bg-white fixed bottom-0 w-full grid grid-cols-2 gap-x-3 p-3 border-t shadow-3xl
        "
          >
            <button
              className="grow p-2 secondary-button"
              disabled={disableButtons}
              onClick={() => handleCopyLink()}
            >
              <span>
                Share &nbsp;
                <IoIosLink className="text-sm" />
              </span>
            </button>
            <button
              className="p-2 primary-button"
              onClick={() => handleCopyToClipBoard()}
            >
              <span>
                Copy to Clipboard &nbsp;
                <IoClipboardOutline />
              </span>
            </button>
          </footer>
        </>
      )}
    </>
  );
};
