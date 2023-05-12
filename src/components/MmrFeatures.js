import statCardImage from "../images/features/statcard.png";
import leaderboardImage from "../images/features/leaderboard.png";
import scoreMatchImage1 from "../images/features/sm1.png";
import scoreMatchImage2 from "../images/features/sm2.png";
import newChannels from "../images/features/newChannels.png";
import newRole from "../images/features/newRole.png";
import { useRecoilValue } from "recoil";
import { windowWidthState, isMobileState } from "../atoms";

const MmrFeatures = () => {
  const windowWidth = useRecoilValue(windowWidthState);
  const isMobile = useRecoilValue(isMobileState);

  return (
    <div
      id="mmr-features"
      className={` w-[100%] h-[100%] flex flex-col justify-center items-center overflow-x-hidden `}
    >
      <div className="font-montserrat text-white text-center text-[22px] border-b-2 border-[#6482d0] mb-14">
        MMR Tracking Features
      </div>
      <div
        className={`px-8 flex ${
          windowWidth < 1300 ? "flex-col" : "flex-row"
        }  justify-evenly items-center w-[100%] max-w-[1200px]`}
      >
        {" "}
        <img
          src={statCardImage}
          alt={"playerStatCard"}
          className={`min-w-[${windowWidth - 20}px] ${
            !isMobile && ""
          } rounded-[10px] `}
        />
        <div className="max-w-[380px] flex flex-col justify-center">
          <div className="text-[20px] text-white mt-4 ">
            <p className="bg-[#6482d0] px-2 font-montserrat">{"Stat Card"}</p>
            <p className="text-[18px] font-opensans">
              {"Command: "}
              <span className="border-[#6482d0] border-b-2">{"$stats"}</span>
            </p>
          </div>
          <div
            className={`font-roboto text-[18px] min-w-[${
              windowWidth - 20
            }px] text-gray-200 mt-2 `}
          >
            A member's stat card highlights their accomplishments, featuring
            current ranking, win rates, seasonal titles, recent game
            performances, and historical trends.
          </div>
        </div>
      </div>

      <div className="border-b-[1px] border-[#6482d0] w-[90%] mt-20"></div>

      <div
        className={`px-8 flex ${
          windowWidth < 1300 ? "flex-col-reverse" : "flex-row"
        } justify-evenly items-center w-[100%] max-w-[966px] mt-20`}
      >
        <div className="max-w-[380px] flex flex-col justify-center">
          <div className="text-[20px] text-white mt-4 ">
            <p className="bg-[#6482d0] px-2 font-montserrat">{"Leaderboard"}</p>
            <p className="text-[18px] font-opensans">
              {"Command: "}
              <span className="border-[#6482d0] border-b-2">{"$ranks"}</span>
            </p>
          </div>
          <div
            className={`font-roboto text-[18px] text-gray-200 mt-2 ${`min-w-[${
              windowWidth - 20
            }px] ${!isMobile && "max-w-[420px]"}`}`}
          >
            The leaderboard showcases all players who have engaged in drafts and
            have been scored. Details include each player's rank, MMR, and
            win/loss record.
          </div>
        </div>
        <img
          src={leaderboardImage}
          alt={"leaderboard"}
          className={`${
            isMobile ? "max-w-[280px]" : "min-w-[310px]"
          }  rounded-[10px] ${windowWidth < 1300 ? "mx-4" : ""}`}
        />
      </div>

      <div className="border-b-[1px] border-[#6482d0] w-[90%] mt-20"></div>

      <div
        className={`px-8 flex ${
          windowWidth < 1300 ? "flex-col" : "flex-row"
        }  justify-evenly items-center w-[100%] max-w-[1150px] mt-20`}
      >
        <div
          className={`flex flex-col ${`min-w-[${windowWidth - 20}px] ${
            !isMobile && ""
          }`}`}
        >
          <img
            src={scoreMatchImage1}
            alt={"scoreMatch"}
            className={`rounded-[10px] mb-2 ${
              windowWidth < 1300 || isMobile ? "mx-4" : "mr-4"
            }`}
          />
          <img
            src={scoreMatchImage2}
            alt={"scoreMatch"}
            className={`rounded-[10px] ${
              windowWidth < 1300 || isMobile ? "mx-4" : "mr-4"
            }`}
          />
        </div>

        <div
          className={`  flex flex-col justify-center ${`min-w-[${
            windowWidth - 20
          }px] ${!isMobile ? "max-w-[380px]" : "max-w-[380px]"}`} `}
        >
          <div className="text-[20px] text-white mt-4 ">
            <p className="bg-[#6482d0] px-2 font-montserrat">{"Score Match"}</p>
            <p className="text-[18px] font-opensans">
              {"Command: "}
              <span className="border-[#6482d0] border-b-2">{"$sm"}</span>
            </p>
          </div>
          <div className=" font-roboto text-[18px] text-gray-200 mt-2">
            <div>
              {`To score matches correctly, follow these steps:`}
              <ul>
                <li>{`▪ Type "$sm" to start.`}</li>
                <li>{`▪ Enter the score, e.g. "9-2".`}</li>
                <li>{`▪ Tag the team.`}</li>
              </ul>
              {`Remember to score winners (e.g., 9-2) and losers (e.g., 2-9)
              separately!`}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-[1px] border-[#6482d0] w-[90%] mt-20"></div>

      <div
        className={`px-8 flex ${
          windowWidth < 1300 ? "flex-col-reverse" : "flex-row"
        } justify-between items-center w-[100%] max-w-[1100px] mt-20 `}
      >
        <div
          className={`flex flex-col justify-center items-start text-start max-w-[380px] ${`min-w-[${
            windowWidth - 20
          }px]`} ${windowWidth > 1300 && "ml-10"}`}
        >
          <div className={`text-[20px] text-white mt-4 w-[100%] `}>
            <p className={`bg-[#6482d0] px-2 font-montserrat  `}>
              {"Category, Channels & Role"}
            </p>
            <p className="text-[18px] font-opensans">
              {"Commands: "}
              <span className="border-[#6482d0] border-b-2">
                {"$sync"}
              </span> &{" "}
              <span className="border-[#6482d0] border-b-2">
                {"$newseason"}
              </span>
            </p>
          </div>
          <div className="font-roboto text-[18px] text-gray-200 mt-2">
            <p>
              Upon joining your server, the bot automatically creates a category
              containing two channels, "draft-result" and "season-leaders." If
              channels are deleted, recreate them and use{" "}
              <span className="border-b-2 border-[#6482d0]">$sync</span> to
              reconnect them.
            </p>
            <div>
              ▪{" "}
              <span className="border-b-2 border-[#6482d0]">
                "draft-result"
              </span>{" "}
              channel keeps a record of each time a player's score is recorded.
            </div>
            <div>
              ▪{" "}
              <span className="border-b-2 border-[#6482d0]">
                "season-leaders"
              </span>{" "}
              channel displays the top 3 players upon season reset, done using{" "}
              <span className="border-b-2 border-[#6482d0]">$newseason</span>{" "}
              command (server owner only).
            </div>
            <p className="mt-10">
              Additionally, the bot creates a "scorekeeper" role, which grants
              members the ability to score matches, ban users from interacting
              with the bot, and lock/unlock drafts as needed.
            </p>
          </div>
        </div>
        <div className={`flex flex-col items-center max-w-[500px]`}>
          <img
            src={newChannels}
            alt={"new channels"}
            className={`min-w-[310px] rounded-[10px] mb-12 ${
              windowWidth < 1300 ? "mx-4" : ""
            }`}
          />
          <img
            src={newRole}
            alt={"scorekeeper role"}
            className={` rounded-[10px] ${
              windowWidth < 1300
                ? `min-w-[${windowWidth - 20}px]`
                : "min-w-[340px]"
            }`}
          />
        </div>
      </div>

      <div className="border-b-[1px] border-[#6482d0] w-[90%] mt-20"></div>
    </div>
  );
};

export default MmrFeatures;
