// import { UseWindowWidth } from "../hooks";
import { useRecoilValue, useRecoilState } from "recoil";
import { windowWidthState, menuOpenState } from "../atoms";

const scrollToView = (section) => {
  const element = document.getElementById(section);
  console.log("SECTION", section);
  console.log("Element", element);

  element.scrollIntoView({ behavior: "smooth" });
};

const Hamburger = () => {
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenState);

  return (
    <button
      className={`hamburger cursor-pointer ${menuOpen ? "open" : ""}`}
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <span className="bar bar1"></span>
      <span className="bar bar2 my-2"></span>
      <span className="bar bar3"></span>
    </button>
  );
};

const Navbar = () => {
  const windowWidth = useRecoilValue(windowWidthState);
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenState);

  return (
    <header className=" text-white sticky top-0 z-50 w-[100%] py-5 ">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center max-w-[1140px] ">
        <div className="font-bold py-3 font-montserrat">DraftBot.net</div>

        {windowWidth > 1142 ? (
          <ul className="flex items-center space-x-4 ">
            <li
              onClick={() => scrollToView("team-draft-features")}
              className="px-2 cursor-pointer font-roboto-s duration-300 hover:text-[#6482d0]"
            >
              Online Demo
            </li>
            <li
              onClick={() => scrollToView("mmr-features")}
              className="px-2 cursor-pointer font-roboto-s duration-300 hover:text-[#6482d0]"
            >
              MMR Features
            </li>
            <li
              onClick={() => scrollToView("footer")}
              className="px-2 cursor-pointer font-roboto-s duration-300 hover:text-[#6482d0]"
            >
              Contact
            </li>
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=881341335355920415&permissions=28033184955505&scope=bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li className="px-4 py-2 rounded-[10px] bg-[#6482d0] cursor-pointer hover:bg-[#415da3] duration-300 font-roboto-s">
                Invite to Discord
              </li>
            </a>
          </ul>
        ) : (
          <Hamburger onClick={() => setMenuOpen(!menuOpen)} />
        )}
      </div>
    </header>
  );
};

export default Navbar;
