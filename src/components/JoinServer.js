/* eslint-disable */
import io from "socket.io-client";
import { useRecoilState } from "recoil";
import {
  joinRoomState,
  usernameState,
  allRoomsState,
  refreshState,
  publicRoomState,
  privateKeyState,
  allUsersState,
} from "../atoms";
// const socketServerURL =
//   process.env.NODE_ENV === "production"
//     ? "https://your-heroku-app.herokuapp.com"
//     : "http://localhost:3002";
// const socket = io("https://draftbotpro.herokuapp.com");
// const socket = io("http://localhost:3001");
const socket = io("https://draftbot.net");

socket.on("connect", () => {
  console.log("connected to server");
});
const JoinServer = ({ socket }) => {
  const [roomToJoin, setRoomToJoin] = useRecoilState(joinRoomState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [allRooms, setAllRooms] = useRecoilState(allRoomsState);
  const [publicRoom, setPublicRoom] = useRecoilState(publicRoomState);
  const [privateKey, setPrivateKey] = useRecoilState(privateKeyState);
  const [allUsers, setAllUsers] = useRecoilState(allUsersState);

  const [refresh, setRefresh] = useRecoilState(refreshState);

  const handleNewUserForm = async (e) => {
    e.preventDefault();
    // setRefresh(!refresh);
    if (roomToJoin !== privateKey) {
      console.log("ALL ROOMS!!!", allRooms);
      let roomExists = false;
      allRooms.forEach((room) =>
        room.rooms === roomToJoin ? (roomExists = true) : null
      );
      if (!roomExists) {
        console.log("all Rooms", allRooms);
        console.log("roomToJoin", roomToJoin);
        alert(`Room ${roomToJoin} does not exist`);
      } else if (roomExists) {
        console.log("JOINEDD");
        console.log("private key before", privateKey);
        const user = allUsers.find((user) => user[1] === username);
        console.log("42user", user);
        console.log("42username", username);

        const newRooms = [...allRooms, roomToJoin];
        setAllRooms(newRooms);
        setPrivateKey(roomToJoin);
        await socket.emit("join_private_room", [
          user[0],
          user[1],
          user[2],
          roomToJoin,
        ]);
        console.log("private key after", roomToJoin);

        // socket.emit("join_private_room", [roomToJoin, username]);
        if (publicRoom) {
          setPublicRoom(false);
        }
      }
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center  w-[fit] h-[160px] rounded-md mr-[1px] overflow-hidden">
      <form
        className="font-montserrat w-[100%] flex flex-col mt-0"
        onSubmit={handleNewUserForm}
      >
        <input
          type="text"
          placeholder="room ID"
          maxLength="4"
          className="text-black font-merriweather pl-1 relative left-[25%] w-[50%] rounded-lg text-sm px-2 py-1"
          onChange={(e) => setRoomToJoin(e.target.value.toUpperCase())}
        />

        <div className="flex font-roboto-s justify-center items-center mt-6 cursor-pointer">
          <button className=" text-white text-[14px] top-[158px] left-[34.5%] bg-[#6482d0] hover:bg-[#415da3] duration-300 rounded-2xl w-fit py-1 px-[18px]">
            Join Room
          </button>
        </div>
      </form>
    </div>
    // <div className="relative flex flex-col justify-center items-center bg-slate-400 w-[300px] h-[200px] rounded-md">
    //   <form
    //     className="font-montserrat w-[100%] flex flex-col mt-0"
    //     onSubmit={handleNewUserForm}
    //   >
    //     <p className="relative left-[22.25%] w-[90%]">Choose a username</p>
    //     <p className="relative text-[12px] left-[16%] w-[100%] mb-4">
    //       Please include at least 1 number
    //     </p>
    //     <input
    //       type="text"
    //       placeholder="username"
    //       className="text-black font-merriweather pl-1 relative left-[25%] w-[50%] rounded-lg text-sm px-2 py-1"
    //       onChange={(e) => setUsername(e.target.value)}
    //     />

    //     <div className="flex justify-center items-center mt-6">
    //       <button className=" text-white top-[158px] left-[34.5%] bg-[#0bdbd0] rounded-2xl w-fit py-1 px-[22px]">
    //         Try Demo
    //       </button>
    //     </div>
    //   </form>
    // </div>
  );
};

export default JoinServer;
