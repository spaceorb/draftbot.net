import { windowWidthState } from "../atoms";
import { useRecoilValue } from "recoil";
import RobotImage from "../images/draftbot-face.png";
// import NavBarFull from "./navBarFull";

const IntroSection = ({ discordServerData }) => {
  // const menuOpen = useRecoilValue(menuOpenState);
  const windowWidth = useRecoilValue(windowWidthState);
  console.log("window width", windowWidth);
  const scrollToView = (section) => {
    const element = document.getElementById(section);
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  let numberOfServers;
  let numberOfPlayers;
  if (discordServerData.length > 0) {
    numberOfServers = discordServerData.length + 2;
    numberOfPlayers = discordServerData
      .map((server) => Number(server.guildMemberCount))
      .reduce((a, b) => a + b);
    console.log("number of players", numberOfPlayers);
    console.log("number of servers", numberOfServers);
  } else {
    console.log("error");
  }

  return (
    <div className={`relative  bg-[#1d1d1e] w-[100%] min-h-[340px] `}>
      <div
        className={`relative font-roboto flex flex-col justify-start items-center max-h-[28px] w-[100%] intro-section mainScroll`}
      >
        <div className="container mx-auto px-4 max-w-xl flex flex-col items-center text-center mt-20">
          <div className="absolute font-roboto flex justify-between items-center w-[260px] top-[22px] bg-[#2f3136] mx-10 py-2 rounded-lg">
            <div className="serverAndMemberCount text-white pl-10">
              Servers: {numberOfServers}
            </div>
            <div className="serverAndMemberCount text-white pr-10">
              Members: {numberOfPlayers}
            </div>
          </div>

          <img
            src={RobotImage}
            alt="robot"
            className="w-[80px] h-[80px] rounded-xl gradient-bg mb-2" // 90x90 px original size
          />
          <h1 className=" mb-2 hero-text-1 text-white font-montserrat">
            DraftBot
          </h1>
          <div className="w-[100%] px-0 mb-6 flex items-center justify-center">
            <p className="text-white  text-[3vw] hero-text-2 text-center tracking-[0.5px]">
              »»— The unparalleled Discord bot that expertly facilitates team
              drafts and MMR tracking. —««
            </p>
          </div>

          <div className="z-10">
            <button
              onClick={() => scrollToView("team-draft-features")}
              className="hero-btn font-opensans tracking-[0.5px]  bg-[#6482d0] text-white py-2 mr-4 rounded-lg hover:bg-[#415da3] transition-all duration-300 shadow-md"
            >
              Online Demo
            </button>
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=881341335355920415&permissions=8&scope=bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="hero-btn font-opensans tracking-[0.5px] bg-[#f1f1f1] text-gray-800 py-2 rounded-lg hover:bg-[#415da3] hover:text-white transition-all duration-300 shadow-md">
                Get Draftbot
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
