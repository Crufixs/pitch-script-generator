import { useMemo, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { CiClock1 } from "react-icons/ci";
import { IoClipboardOutline } from "react-icons/io5";

export default function GeneratedPitchScript({
  pitchDeck,
  width,
  convertToMarkdown,
}) {
  const totalTime = useMemo(() => {
    let time = 0;

    pitchDeck.map((item) => {
      time += item.time;
    });

    return time;
  }, [pitchDeck]);

  const handleCopyToClipBoard = (pitch) => {
    let markDownFormat = convertToMarkdown([pitch]);
    navigator.clipboard.writeText(markDownFormat);
  };

  return (
    <div
      className={`w-full p-4 overflow-auto ${
        width > 640 ? "h-full bg-gray-100" : "bg-white"
      }`}
    >
      {width > 640 && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-5 ">
          <p className="font-geologica lg:text-lg font-medium">
            Your Generated Pitch Script
          </p>
          <p>
            {totalTime
              ? totalTime > 60
                ? `${Math.floor(totalTime / 60) % 60} minutes${
                    totalTime % 60 > 0 ? ` and ${totalTime % 60} seconds` : ""
                  }`
                : `${totalTime} seconds`
              : null}
          </p>
        </div>
      )}

      <div className="flex flex-col overflow-y-auto gap-y-4">
        {pitchDeck.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border">
            <div className="w-full flex justify-between">
              <div>
                {item.title}&nbsp;&nbsp;
                {item.time && (
                  <span className="text-gray-400 font-light">
                    <CiClock1 className="inline mx-1 font-normal" />
                    {item.time > 60
                      ? `${item.time / 60} minute/s`
                      : `${item.time} second/s`}
                  </span>
                )}
              </div>
              <div className="flex text-sm">
                {item.content && (
                  <>
                    <button
                      className="border-0"
                      onClick={() => {
                        handleCopyToClipBoard(item);
                      }}
                    >
                      <IoClipboardOutline />
                    </button>
                    <button className="border-0">
                      <LuRefreshCw />
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-400 font-light">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
