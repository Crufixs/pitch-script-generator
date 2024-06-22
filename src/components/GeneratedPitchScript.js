import { useMemo } from "react";
import ProgressBar from "./ProgressBar";
import { LuRefreshCw } from "react-icons/lu";

import { IoClipboardOutline } from "react-icons/io5";

export default function GeneratedPitchScript({
  pitchDeck,
  isLoading,
  loadingProgress,
}) {
  const totalTime = useMemo(() => {
    let time = 0;

    pitchDeck.map((item) => {
      time += item.time;
    });

    return time;
  }, [pitchDeck]);

  return (
    <div className="relative overflow-auto">
      <div className="w-full bg-gray-100 p-5 overflow-auto h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 ">
          <p className="font-geologica md:text-lg font-medium">
            Your Generated Pitch Script
          </p>
          <p>{totalTime} minutes</p>
        </div>
        <div className="flex flex-col overflow-y-auto gap-y-5">
          {pitchDeck.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-5 border">
              <div className="w-full flex justify-between">
                <div>
                  {item.title}&nbsp;
                  {item.time && (
                    <span className="text-gray-400 text-sm">
                      Time: {item.time} second/s
                    </span>
                  )}
                </div>
                <div className="flex text-sm">
                  {item.content && (
                    <>
                      <button className="border-0">
                        <IoClipboardOutline />
                      </button>
                      <button className="border-0">
                        <LuRefreshCw />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
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
  );
}
