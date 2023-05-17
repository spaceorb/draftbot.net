import discordWhite from "../images/discord-white.png";
import {
  isMobileState,
  windowWidthState,
  viewCommandsState,
  revealChatLeftState,
} from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";

const Footer = () => {
  const isMobile = useRecoilValue(isMobileState);
  const windowWidth = useRecoilValue(windowWidthState);
  const [viewCommands, setViewCommands] = useRecoilState(viewCommandsState);
  const [revealChatLeft, setRevealChatLeft] =
    useRecoilState(revealChatLeftState);
  const scrollToView = (section) => {
    const element = document.getElementById(section);
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  const handleViewCommands = () => {
    setRevealChatLeft(true);
    setViewCommands(true);
    scrollToView("team-draft-features");
  };
  return (
    <div id="footer" className="flex flex-col items-center justify-center ">
      <div className="getting-started  mt-20 w-[90%] flex flex-col items-center justify-center mb-14">
        <p className="font-montserrat text-white text-center text-[30px] mb-3">
          Getting Started
        </p>

        <div
          className={`flex items-center justify-center ${
            isMobile && windowWidth < 430 ? "flex-col " : "flex-row"
          }`}
        >
          <a
            href="https://discord.com/api/oauth2/authorize?client_id=881341335355920415&permissions=8&scope=bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="font-roboto-s bg-[#6482d0] flex flex-row items-center justify-center text-white px-5 py-2 rounded-[4px] mx-1 my-1 cursor-pointer">
              <div className="w-[24px] mr-2">
                <img src={discordWhite} alt={"discord"} />
              </div>
              <p className="footer-btn-size">Add to Discord</p>
            </div>
          </a>
          <div
            onClick={() => handleViewCommands()}
            className="font-roboto-s bg-[#6482d0] flex items-center justify-center max-w-max text-white px-5 py-2 rounded-[4px] mx-1 my-1 cursor-pointer"
          >
            {/* <div className="w-[24px] mr-2">
              <img src={discordWhite} alt={"discord"} />
            </div> */}
            <p className="footer-btn-size">View Commands</p>
          </div>
        </div>
      </div>

      <div className="getting-started w-[100%]  bg-[#36393F] text-white text-center py-10">
        <p>
          Have any questions or suggestions? {windowWidth < 1300 && <br />}
          <span className="text-[#6482d0] cursor-pointer">
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add me directly on Discord!
            </a>
          </span>{" "}
        </p>
        <p className="text-[18px] ">
          <span className="border-b-2 border-[#6482d0] ">Syntax#9110</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
