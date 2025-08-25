import { MoonIcon } from "@heroicons/react/24/outline";
import { SunIcon } from "@heroicons/react/24/outline";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const TopNav = ({notes}) => {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-b-neutral-200 w-full">
      <h1 className="text-2xl font-extrabold"> All Notes ({notes.length}) </h1>

      <div className="flex items-center gap-3">
        <div className="flex relative items-center ">
          <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 absolute ml-3" />
          <input
            type="search"
            name="search"
            id="search"
            className="py-3 px-9 border text-neutral-950  placeholder-neutral-500 border-neutral-200 rounded-lg decoration-neutral-300 text-sm focus:outline-none"
            placeholder="Search by title, content, or tags..."
            size={28}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            className="py-3 px-3 hover:bg-neutral-200 border border-neutral-200 cursor-pointer rounded-lg"
          >
              <MoonIcon className="w-5 h-5 stroke-neutral-500" />
          </button>
          <button
            className="py-3 px-3 hover:bg-neutral-200 border border-neutral-200 rounded-lg cursor-pointer"
          >
            <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
