/* eslint-disable */
import io from "socket.io-client";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  usernameState,
  publicRoomState,
  userState,
  isMobileState,
} from "./atoms";
import Chat from "./Chat";
import IntroSection from "./pages/IntroSection";
import { UseWindowWidth, IsDeviceMobile } from "./hooks";
import NavBarFull from "../src/pages/navBarFull";
import Dropdown from "./components/Dropdown";
import MmrFeatures from "./components/MmrFeatures";
import Footer from "./components/Footer.js";

// const socketServerURL =
//   process.env.NODE_ENV === "production"
//     ? "https://your-heroku-app.herokuapp.com"
//     : "http://localhost:3002";
const socket = io("https://draftbot.net");
// const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("connected to server");
});

function App() {
  const user = useRecoilValue(userState);
  const username = useRecoilValue(usernameState);
  const publicRoom = useRecoilValue(publicRoomState);
  const isMobile = useRecoilValue(isMobileState);

  UseWindowWidth();
  IsDeviceMobile();

  useEffect(() => {
    socket.emit("initial_messages");
    socket.emit("initial_private_messages");
    socket.emit("get_rooms");
  }, []);

  let scrollTimeout;

  function onScroll() {
    clearTimeout(scrollTimeout);
    document.body.classList.add("show-scrollbar");

    scrollTimeout = setTimeout(() => {
      document.body.classList.remove("show-scrollbar");
    }, 1000);
  }

  window.addEventListener("scroll", onScroll);

  return (
    <div className="relative flex flex-col justify-between ">
      <NavBarFull />
      <Dropdown />
      <div className="">
        <IntroSection id="intro-section" className="" />
      </div>
      <div className="bg-[#1d1d1e] overflow-x-hidden">
        <div className={`${isMobile ? "wave-bg-mobile" : "wave-bg"} z-0`}></div>
        <Chat
          socket={socket}
          username={username}
          user={user}
          room={publicRoom ? "public" : "private"}
          className="block"
        />
        <div className="wave-bg2 z-0"></div>
      </div>
      <MmrFeatures />
      <Footer />
    </div>
  );
}

export default App;
