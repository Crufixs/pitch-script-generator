import { IoClipboardOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";

export default function Header() {
  return (
    <div className="w-full flex justify-between p-5 sm:border-b">
      <div
        className={
          "flex m-auto gap-x-5 font-geologica flex-col text-2xl " +
          "sm:mx-0 sm:flex-row sm:text-xl md:text-2xl"
        }
      >
        <span className="font-medium text-center sm:text-start">Fornax AI</span>
        <span className="text-center sm:text-start">
          Pitch Script Generator
        </span>
      </div>
      <div className="hidden sm:flex gap-x-5 text-sm">
        <button className="p-2 secondary-button">
          <span>
            Share &nbsp;
            <IoIosLink className="text-sm" />
          </span>
        </button>
        <button className="p-2 primary-button">
          <span>
            Copy to Clipboard &nbsp;
            <IoClipboardOutline />
          </span>
        </button>
      </div>
    </div>
  );
}
