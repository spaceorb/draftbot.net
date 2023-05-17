import { useRecoilState, useRecoilValue } from "recoil";
import { menuOpenState, windowWidthState } from "../atoms/index";

const Dropdown = () => {
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenState);
  const windowWidth = useRecoilValue(windowWidthState);

  const scrollToView = (section) => {
    const element = document.getElementById(section);
    console.log("SECTION", section);
    console.log("Element", element);

    element.scrollIntoView({ behavior: "smooth" });
  };

  // blur background when menu is open
  return (
    <div
      className={`${
        menuOpen && windowWidth <= 1142 ? "" : "hidden"
      } flex flex-col items-end justify-center font-kanit border-b-2 border-[#6482d0] tracking-[0.5px]`}
    >
      <div
        onClick={() => scrollToView("team-draft-features")}
        className="pr-4 hover:bg-[#6482d0] w-[100%] text-end cursor-pointer text-gray-200 mb-2 text-lg font-roboto"
      >
        Online Demo
      </div>
      <div
        onClick={() => scrollToView("mmr-features")}
        className="pr-4 hover:bg-[#6482d0] w-[100%] text-end cursor-pointer text-gray-200 mb-2 text-lg font-roboto"
      >
        MMR Features
      </div>
      <div
        onClick={() => scrollToView("footer")}
        className="pr-4 hover:bg-[#6482d0] w-[100%] text-end cursor-pointer text-gray-200 mb-2 text-lg font-roboto"
      >
        Contact
      </div>
      <a
        href="https://discord.com/api/oauth2/authorize?client_id=881341335355920415&permissions=8&scope=bot"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[100%]"
      >
        <div className="pr-4 hover:bg-[#6482d0] w-[100%] text-end cursor-pointer text-gray-200 mb-4 text-lg font-roboto">
          Invite to Discord
        </div>
      </a>
    </div>
  );
};

export default Dropdown;
