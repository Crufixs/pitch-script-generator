import { useMemo, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import { IoClipboardOutline } from "react-icons/io5";

export default function GeneratedPitchScript({ pitchDeck, width }) {
  const totalTime = useMemo(() => {
    let time = 0;

    pitchDeck.map((item) => {
      time += item.time;
    });

    return time;
  }, [pitchDeck]);

  return (
    <div
      className={`w-full p-5 overflow-auto ${
        width > 640 ? "h-full bg-gray-100" : "bg-white"
      }`}
    >
      {width > 640 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 ">
          <p className="font-geologica md:text-lg font-medium">
            Your Generated Pitch Script
          </p>
          <p>
            {totalTime
              ? totalTime > 60
                ? `${(totalTime / 60).toFixed(2)} minutes`
                : `${totalTime} seconds`
              : null}
          </p>
        </div>
      )}

      <div className="flex flex-col overflow-y-auto gap-y-5">
        {pitchDeck.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-5 border">
            <div className="w-full flex justify-between">
              <div>
                {item.title}&nbsp;
                {item.time && (
                  <span className="text-gray-400 text-sm">
                    Time:{" "}
                    {item.time > 60
                      ? `${item.time / 60} minute/s`
                      : `${item.time} second/s`}
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
  );
}
