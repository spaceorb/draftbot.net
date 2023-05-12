/* eslint-disable */
import io from "socket.io-client";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  usernameState,
  publicRoomState,
  userState,
  setShowChatState,
  userWantsToJoinState,
  windowWidthState,
} from "../atoms";
import Filter from "bad-words";

const socket = io("https://draftbot.net");

socket.on("connect", () => {
  console.log("connected to server");
});
const TryDemo = (props) => {
  const [user, setUser] = useRecoilState(userState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [publicRoom, setPublicRoom] = useRecoilState(publicRoomState);
  const [showChat, setShowChat] = useRecoilState(setShowChatState);
  const [userWantsToJoin, setUserWantsToJoin] =
    useRecoilState(userWantsToJoinState);
  const windowWidth = useRecoilValue(windowWidthState);

  const joinRoom = (room, usernameA, color) => {
    if (username !== "" && room !== "") {
      // socket.emit("get_rooms");
      // console.log("zzkljfksdjfssfdlfas");
      room === "public"
        ? socket.emit("join_public_room", [room, usernameA, color])
        : socket.emit("join_private_room", [room, usernameA, color]);
    }
  };

  const handleNewUserForm = async (e) => {
    e.preventDefault();
    function containsBadWords(username) {
      const filter = new Filter();

      // Custom regular expression to match common patterns used to bypass the filter
      const customProfanityRegex =
        /(?:[a@4][s$5][s$5]|[fph][u@][kcq]|[s$5]h[i1!][t7+]|[b6]i?[@a]t[chx]|d[i1!][kc]k|[c6][o0][kc]k|[p9]e[n]?i[s5]|[a@4]n?[u@4][s$5]|[a@4][r5][s$5]e|[c6][l1][i1!][t7+]|[d4][i1!][kc]|[p9][u@][s$5][s$5][yj]|[a@4][s$5]h[o0][l1][e3]|[d4][a@][m][n])/i;

      return filter.isProfane(username) || customProfanityRegex.test(username);
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (containsBadWords(username)) {
      alert("Please use appropriate usernames.");
      return false;
    } else if (!regex.test(username)) {
      alert("Please use only letters and numbers in your username.");
      return false;
    } else if (username.length > 12) {
      alert("Username must not exceed 12 characters.");
      return false;
    }

    let isPublic;
    let minutes = new Date(Date.now()).getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    if (publicRoom !== null) isPublic = publicRoom ? "public" : "private";
    const newUser = {
      username,
      room: isPublic,
    };

    setUser(newUser);
    setShowChat(true);
    joinRoom(isPublic, username, "temp");
    setUserWantsToJoin(true);
    if (publicRoom) {
      const messageData = {
        room: isPublic,
        author: "Draft Bot",
        message: `Welcome, ${username.toUpperCase()}! Commands are on the left and more details can be found below. 🙂`,
        time: new Date(Date.now()).getHours() + ":" + minutes,
      };
      socket.emit("send_message", messageData);
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-w-[${
        windowWidth - 74
      }px] h-[200px] rounded-md`}
    >
      <form
        className="font-roboto-s w-[100%] text-gray-200 flex flex-col justify-center items-center  mt-0"
        onSubmit={handleNewUserForm}
      >
        <p className="mb-1">What should we call you?</p>

        <input
          type="text"
          placeholder="username"
          className="text-black rounded-lg text-sm px-1 py-1 mt-1 font-opensans"
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* <p className="text-[13px] mt-2">
          {"(Please include at least 1 number)"}
        </p> */}
        <div className="flex justify-center items-center mt-4">
          <button className=" text-white text-[16px] bg-[#6482d0] hover:bg-[#415da3] duration-300 rounded-2xl w-fit py-1 px-[22px]">
            Sign-in
          </button>
        </div>
      </form>
    </div>
  );
};

export default TryDemo;
