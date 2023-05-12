// import io from "socket.io-client";
import React from "react";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentMessageState,
  messageListState,
  publicRoomState,
  userWantsToJoinState,
  allUsersState,
  privateMessageListState,
  commandsState,
  privateKeyState,
  viewCommandsState,
  JoinServerState,
  allRoomsState,
  privateUsersState,
  windowWidthState,
  revealChatRightState,
  revealChatLeftState,
  isMobileState,
} from "./atoms";
import { IsDeviceMobile } from "./hooks";
import RobotFaceImage from "./images/draftbot-face.png";
import ProfilePic from "../src/components/ProfilePic";
import TryDemo from "./components/TryDemo";
import JoinServer from "./components/JoinServer";

const CreateUserBgChat = ({ allUsers, msg }) => {
  const foundUser = allUsers.find((user) => user[1] === msg.author);

  return (
    <div>
      {foundUser && (
        <ProfilePic
          username={foundUser[1].toUpperCase()}
          color={foundUser[2]}
        />
      )}
    </div>
  );
};

function Chat({ socket, username, room, user }) {
  const [currentMessage, setCurrentMessage] =
    useRecoilState(currentMessageState);
  const [messageList, setMessageList] = useRecoilState(messageListState);
  const [privateMessageList, setPrivateMessageList] = useRecoilState(
    privateMessageListState
  );
  const [allRooms, setAllRooms] = useRecoilState(allRoomsState);
  const [privateKey, setPrivateKey] = useRecoilState(privateKeyState);
  const [viewCommands, setViewCommands] = useRecoilState(viewCommandsState);
  const commands = useRecoilValue(commandsState);
  const [publicRoom, setPublicRoom] = useRecoilState(publicRoomState);
  const [joinServer, setJoinServer] = useRecoilState(JoinServerState);
  const [privateUsers, setPrivateUsers] = useRecoilState(privateUsersState);
  const [revealChatRight, setRevealChatRight] =
    useRecoilState(revealChatRightState);
  const [revealChatLeft, setRevealChatLeft] =
    useRecoilState(revealChatLeftState);

  const [allUsers, setAllUsers] = useRecoilState(allUsersState);
  const userWantsToJoin = useRecoilValue(userWantsToJoinState);
  const windowWidth = useRecoilValue(windowWidthState);
  const isMobile = useRecoilValue(isMobileState);
  IsDeviceMobile();

  const chatScrollRef = useRef(null);
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messageList, privateMessageList]);

  useEffect(() => {
    if (windowWidth <= 890) {
      setRevealChatRight(false);
      setRevealChatLeft(false);
    } else {
      setRevealChatRight(true);
      setRevealChatLeft(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    // socket.on("welcome_user", (result) => {
    //   console.log("welcome_user", result);
    // });
    socket.on("receive_rooms", (result) => {
      setAllRooms(result);
    });
    socket.on("new_rooms", (result) => {
      setAllRooms(result);
    });
    socket.on("userLeft", (result) => {
      console.log("users after user left before:", result);
      let users = Object.values(result)[0].map((user) => [
        user.user[0],
        user.user[1],
        user.user[2],
        user.user[3],
      ]);
      console.log("users after user left after (result): ", result);

      console.log("users after user left after (users):", users);

      setAllUsers(users);
    });
    socket.on("privateUserLeft", (result) => {
      setPrivateUsers(result);
    });
    socket.on("receive_initial_private_messages", (result) => {
      setPrivateMessageList(result.map((msg) => msg.message));
    });
    socket.on("receive_private_messages", ({ allPrivateMsgs }) => {
      setPrivateMessageList(allPrivateMsgs.map((msg) => msg.message));
    });
    socket.on("receive_private_users", (result) => {
      setPrivateUsers(result);
    });
    socket.on("receive_online_users", (result) => {
      let users = Object.values(result)[0].map((user) => [
        user.user[0],
        user.user[1],
        user.user[2],
        user.user[3],
      ]);
      setAllUsers(users);
    });
    socket.on("receive_initial_messages", (result) => {
      setMessageList(result.map((msg) => msg.message));
    });
    socket.on("receive_message", ({ newMessage, result }) => {
      setMessageList(result.map((msg) => msg.message));
    });
    socket.on("discordBot_message", ({ newMessage, result }) => {
      console.log("discord newmsg", newMessage);
      if (newMessage.roomId === "public") {
        setMessageList(result.map((msg) => msg.message));
      } else {
        setPrivateMessageList(result.map((msg) => msg.message));
      }
    });
  }, [socket]);

  const joinRoom = async (room, user) => {
    if (username !== "" && room !== "") {
      if (room === "public") {
        setPrivateKey(null);

        socket.emit("join_public_room", user);
      }

      if (room !== "public") {
        const chars = "5ABCDE7FGHIJ1KLM6NP8Q2RSTUVW3XYZ49";
        var privateRoomKey = "";
        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          privateRoomKey += chars.charAt(randomIndex);
        }
        let minutes = new Date(Date.now()).getMinutes();
        // minutes = convertTime(minutes);
        const messageData = {
          room: privateRoomKey,
          author: "Draft Bot",
          message: `Your room's ID to share with friends: ${privateRoomKey}`,
          time: new Date(Date.now()).getHours() + ":" + minutes,
        };
        const newRooms = [...allRooms, privateRoomKey];
        setAllRooms(newRooms);
        setPrivateKey(privateRoomKey);
        await socket.emit("join_private_room", [
          user[0],
          user[1],
          user[2],
          privateRoomKey,
        ]);
        await socket.emit("send_private_message", messageData);
      }
    }
  };
  const sendPrivateMessage = async (e) => {
    e.preventDefault();

    if (currentMessage !== "") {
      let minutes = new Date(Date.now()).getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const messageData = {
        room: privateKey,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + minutes,
      };
      await socket.emit("send_private_message", messageData);

      setPrivateMessageList((plist) => [...plist, messageData]);

      setCurrentMessage("");
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      let minutes = new Date(Date.now()).getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + minutes,
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  const convertTime = (time) => {
    const [hour, minute] = time.split(":");
    const hours = parseInt(hour, 10);
    const amPm = hours >= 12 ? "PM" : "AM";

    const adjustedHours = hours % 12 || 12;

    return `${adjustedHours.toString()}:${
      String(minute).length === 1 ? `0${minute}` : minute
    } ${amPm}`;
  };
  const formatDate = () => {
    const d = new Date();
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "long" });
    const year = d.getFullYear();

    let suffix = "th";
    if (day % 10 === 1 && day !== 11) {
      suffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      suffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      suffix = "rd";
    }

    const formattedDate = `${month} ${day}${suffix}, ${year}`;
    return formattedDate;
  };

  const showPrivateServerMsg = (list) => {
    return (
      <div className="z-10">
        {list.map((msg, i) => {
          // msg = msg.message.split(" ");
          let fullMessage;
          let draftList;

          fullMessage = msg.message
            .split(" ")
            .filter((word) => word.length > 0);
          draftList = fullMessage.slice(
            fullMessage.indexOf("List:\n") + 1,
            fullMessage.indexOf("Team")
          );

          if (msg.room === privateKey) {
            const messageCondition = () => {
              if (msg.author === "Draft Bot") {
                return true;
              }
              if (i >= 1) {
                if (
                  privateMessageList[i - 1].author !== msg.author ||
                  privateMessageList[i - 1].time !== msg.time
                ) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            };

            return (
              <div
                key={`${msg.messageKey}-${i}`}
                className={`p-0 ml-[16px] flex ${
                  messageCondition() && "mt-4"
                } chat-message`}
              >
                {messageCondition() ? (
                  msg.author === "Draft Bot" ? (
                    <div
                      className={`gradient-bg flex justify-center items-center  max-h-[42px] max-w-[42px] rounded-full mt-[3px]`}
                    >
                      <img
                        src={RobotFaceImage}
                        alt="javascript"
                        className=" max-h-[42px] max-w-[42px] z-0 rounded-full"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex justify-center items-center  max-h-[42px] max-w-[42px] pr-1 rounded-full mt-[3px]`}
                    >
                      <CreateUserBgChat msg={msg} allUsers={allUsers} />
                    </div>
                  )
                ) : (
                  <div
                    className={` flex font-roboto justify-center items-center min-w-[42px]  max-w-[42px] rounded-full msg-time `}
                  >
                    {convertTime(msg.time)}
                  </div>
                )}

                <div className="message-meta  ml-[14px] font-roboto flex flex-col items-start w-[100%] h-fit">
                  <div className=" message-meta chat-message flex flex-col items-start w-[100%] mb-[0px]">
                    {messageCondition() && (
                      <div className="flex items-center pr-2 font-opensans w-[100%]">
                        {msg.author}
                        {msg.author === "Draft Bot" && (
                          <div className="flex justify-center items-center font-opensans ml-[4px] mr-[1px] bg-[#5b66ed] px-[5px] py-[0.10px] w-fit h-fit text-[10px] discord-bot-tag">
                            BOT
                          </div>
                        )}
                        <p className="font-opensans pl-[8px] text-[11.5px] text-gray-400">
                          Today at {convertTime(msg.time)}
                        </p>
                      </div>
                    )}
                    {msg.author !== "Draft Bot" && !messageCondition() ? (
                      <p className="stext-slate-200">{msg.message}</p>
                    ) : (
                      msg.author !== "Draft Bot" && (
                        <p className="stext-slate-200">{msg.message}</p>
                      )
                    )}
                    {msg.author === "Draft Bot" &&
                      msg.message.includes("⚔️") && (
                        <div className="flex flex-col">
                          <div className="people-symbol pb-2">
                            {fullMessage[0]}{" "}
                            <span className="font-montserrat text-bold">
                              {fullMessage[1]}
                            </span>
                          </div>
                          <div className="empty-space pb-2"> </div>
                          <div
                            className={`empty-space font-montserrat text-md text-bold pb-0 ${
                              draftList.length === 0 && "mb-4"
                            }`}
                          >
                            {fullMessage[2] + " " + fullMessage[3]}
                          </div>
                          {draftList.map((player) => (
                            <div className="pb-0">{player}</div>
                          ))}
                          <div className="members font-montserrat text-bold team-1 pb-2 pt-4">
                            Team 1:{console.log(fullMessage)}
                            <span className="font-kanit">
                              {fullMessage[fullMessage.indexOf("1:") + 1] ===
                              "Team"
                                ? ""
                                : fullMessage[fullMessage.indexOf("1:") + 1]}
                            </span>
                          </div>
                          <div className="members font-montserrat text-bold team-1 pb-2 mt-2">
                            Team 2:{" "}
                            <span className="font-kanit">
                              {fullMessage[fullMessage.indexOf("2:") + 1] ===
                              "Team"
                                ? ""
                                : fullMessage[fullMessage.indexOf("2:") + 1]}
                            </span>
                          </div>
                        </div>
                      )}
                    {msg.author === "Draft Bot" &&
                      msg.message.includes("Welcome") && (
                        <div className="text-[#6482d0]">{msg.message}</div>
                      )}
                    {msg.author === "Draft Bot" &&
                      !msg.message.includes("Welcome") &&
                      !msg.message.includes("⚔️") &&
                      !msg.message.includes("$ban/unban") && (
                        <div>{msg.message}</div>
                      )}
                    {msg.author === "Draft Bot" &&
                      msg.message.includes("$ban/unban") && (
                        <div className="flex flex-col">
                          {msg.message.split("^").map((cmd) => (
                            <div>{cmd}</div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };
  const showPublicServerMsg = (list) => {
    return (
      <div className="z-10">
        {list.map((msg, i) => {
          let fullMessage;
          let draftList;

          fullMessage = msg.message
            .split(" ")
            .filter((word) => word.length > 0);
          draftList = fullMessage.slice(
            fullMessage.indexOf("List:\n") + 1,
            fullMessage.indexOf("Team")
          );

          const messageCondition = () => {
            if (i >= 1) {
              if (
                messageList[i - 1].author !== msg.author ||
                messageList[i - 1].time !== msg.time
              ) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          };

          return (
            <div
              key={`${msg.messageKey}-${i}`}
              className={`p-0 ml-[16px] flex ${
                messageCondition() && "mt-4"
              } chat-message `}
            >
              {messageCondition() ? (
                msg.author === "Draft Bot" ? (
                  <div
                    className={`gradient-bg flex justify-center items-center  max-h-[42px] max-w-[42px] rounded-full mt-[3px]`}
                  >
                    <img
                      src={RobotFaceImage}
                      alt="javascript"
                      className=" max-h-[42px] max-w-[42px] z-0 rounded-full"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex justify-center items-center pr-1 max-h-[42px] max-w-[42px] rounded-full mt-[0px]`}
                  >
                    <CreateUserBgChat msg={msg} allUsers={allUsers} />
                  </div>
                )
              ) : (
                <div
                  className={` flex font-roboto justify-center items-center min-w-[42px]  max-w-[42px] rounded-full msg-time `}
                >
                  {convertTime(msg.time)}
                </div>
              )}

              <div className="message-meta  ml-[14px] font-roboto flex flex-col items-start w-[100%] h-fit">
                <div className=" message-meta chat-message flex flex-col items-start w-[100%] mb-[0px]">
                  {messageCondition() && (
                    <div className="flex items-center pr-2 font-opensans w-[100%]">
                      {msg.author}
                      {msg.author === "Draft Bot" && (
                        <div className="flex justify-center items-center font-opensans ml-[4px] mr-[1px] bg-[#5b66ed] px-[5px] py-[0.10px] w-fit h-fit text-[10px] discord-bot-tag">
                          BOT
                        </div>
                      )}
                      <p className="font-opensans pl-[8px] text-[11.5px] text-gray-400">
                        Today at {convertTime(msg.time)}
                      </p>
                    </div>
                  )}
                  {msg.author !== "Draft Bot" && !messageCondition() ? (
                    <p className="stext-slate-200">{msg.message}</p>
                  ) : (
                    msg.author !== "Draft Bot" && (
                      <p className="stext-slate-200">{msg.message}</p>
                    )
                  )}
                  {msg.author === "Draft Bot" && msg.message.includes("⚔️") && (
                    <div className="flex flex-col">
                      <div className="people-symbol pb-2">
                        {fullMessage[0]}{" "}
                        <span className="font-montserrat text-bold">
                          {fullMessage[1]}
                        </span>
                      </div>
                      <div className="empty-space pb-2"> </div>
                      <div
                        className={`empty-space font-montserrat text-md text-bold pb-0 ${
                          draftList.length === 0 && "mb-4"
                        }`}
                      >
                        {fullMessage[2] + " " + fullMessage[3]}
                      </div>
                      {draftList.map((player) => (
                        <div className="pb-0">{player}</div>
                      ))}
                      <div className="members font-montserrat text-bold team-1 pb-2 pt-4">
                        Team 1:{" "}
                        <span className="font-kanit">
                          {fullMessage[fullMessage.indexOf("1:") + 1] === "Team"
                            ? ""
                            : fullMessage[fullMessage.indexOf("1:") + 1].split(
                                " - "
                              )}
                        </span>
                      </div>
                      <div className="members font-montserrat text-bold team-1 pb-2 mt-2">
                        Team 2:{" "}
                        <span className="font-kanit">
                          {fullMessage[fullMessage.indexOf("2:") + 1] === "Team"
                            ? ""
                            : fullMessage[fullMessage.indexOf("2:") + 1]}
                        </span>
                      </div>
                    </div>
                  )}
                  {msg.author === "Draft Bot" &&
                    msg.message.includes("Welcome") && (
                      <div className="text-[#6482d0]">{msg.message}</div>
                    )}
                  {msg.author === "Draft Bot" &&
                    !msg.message.includes("Welcome") &&
                    !msg.message.includes("⚔️") &&
                    !msg.message.includes("$ban/unban") && (
                      <div>{msg.message}</div>
                    )}
                  {msg.author === "Draft Bot" &&
                    msg.message.includes("$ban/unban") && (
                      <div className="flex flex-col">
                        {msg.message.split("^").map((cmd) => (
                          <div>{cmd}</div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDoubleRevealChat = (direction) => {
    if (direction === "right") {
      setRevealChatLeft(false);
      setRevealChatRight(true);
    } else if (direction === "left") {
      setRevealChatLeft(true);
      setRevealChatRight(false);
    } else if (direction === "center") {
      setRevealChatLeft(false);
      setRevealChatRight(false);
    }
  };
  const handleServerChange = async (server) => {
    const userToChange = allUsers.find((user) => user[1] === username);
    if (!viewCommands || publicRoom) {
      joinRoom(server, userToChange);
      server === "public" ? setPublicRoom(true) : setPublicRoom(false);
    } else if (!publicRoom && server === "public") {
      joinRoom(server, userToChange);
      server === "public" ? setPublicRoom(true) : setPublicRoom(false);
    }
    setViewCommands(false);
  };
  const handleJoinServer = () => {
    console.log("joinServer before", joinServer);
    setJoinServer(!joinServer);
    console.log("joinServer after", joinServer);
  };

  return (
    <div
      id="team-draft-features"
      className=" bg-[#6482d0] flex flex-col items-center justify-center"
    >
      <div className="font-montserrat bg-[#6482d0] text-white text-center text-[22px] border-b-2 border-[#1d1d1e] mb-28">
        Team Drafting Features
      </div>{" "}
      <div
        id="chat-section"
        className="relative font-montserrat flex flex-col items-center justify-center bg-[#6482d0] h-[80vh] w-[100%] min-h-[500px] max-h-[850px]"
      >
        <div
          className={`flex flex-row items-center justify-center text-white w-[100%]`}
        >
          <div className="absolute bg-[#2F3136] w-[140px] h-[36px] mb-[100px] "></div>
          <div className="absolute bg-[#00ab14] w-[8px] h-[8px] rounded-full mb-[100px] mr-[62px]"></div>
          <p className="absolute  mb-[102px] ml-[16px] font-opensans tracking-[0.5px] ">
            Online
          </p>
        </div>
        {!userWantsToJoin && (
          <div className="flex flex-row  w-[90%] h-[100%] justify-center items-center relative bg-[#36393F] rounded-2xl ">
            {windowWidth > 890 ? (
              <div className="font-roboto rounded-l-2xl chat-body-left bg-[#2F3136] min-w-[240px] max-w-[240px] h-[80vh] min-h-[500px] max-h-[850px] chatScroll overflow-y-scroll shadow-right">
                <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px] mt-4">
                  Servers
                </div>
                <div
                  onClick={() => !publicRoom && handleServerChange("public")}
                  className={` public-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                    publicRoom
                      ? "bg-opacity-30"
                      : "bg-opacity-0 hover:bg-opacity-10"
                  }  rounded-md m-3 cursor-pointer `}
                >
                  <p
                    className={`p-1 font-roboto ${
                      windowWidth > 876 ? "text-md" : "text-[13px] text-center"
                    } `}
                  >
                    {" "}
                    # public
                  </p>
                </div>

                <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px]">
                  Help
                </div>
                <div
                  onClick={() => setViewCommands(!viewCommands)}
                  className={` flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 rounded-md m-3 cursor-pointer bg-opacity-0 hover:bg-opacity-10 `}
                >
                  <p className="text-md p-1"> # commands</p>
                </div>
                <div className="z-10">
                  {joinServer && <JoinServer socket={socket} />}
                </div>
                {viewCommands && (
                  <div className="flex flex-col ">
                    {viewCommands &&
                      commands.map((cmd) => {
                        if (!cmd.includes("$")) {
                          return (
                            <div
                              className={`text-xl mb-2 mt-2 text-white flex items-center justify-center bg-[#6482d0] text-center ${
                                isMobile ? "mx-2" : "ml-3"
                              } `}
                            >
                              {cmd}
                            </div>
                          );
                        }
                        return (
                          <div className="justify-items-center ml-2 flex flex-col items-start justify-center">
                            <div className="text-[#6482d0] text-start text-lg ">
                              {cmd.split(" ").slice(0, 1)}
                            </div>{" "}
                            <div className="text-[16px] text-gray-200 text-start mb-2">
                              {cmd.split(" ").slice(1).join(" ")}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              revealChatLeft &&
              !revealChatRight && (
                <div className="absolute left-0 bottom-0 flex items-end z-10">
                  <div
                    onClick={() => setRevealChatLeft(!revealChatLeft)}
                    className="chat-body-left-stub px-2 bg-transparent min-w-[10px] h-[80vh] min-h-[500px] max-h-[850px] rounded-l-2xl flex items-center justify-center text-white text-[20px] cursor-pointer"
                  >
                    <div className="h-[30px] w-[3px] rounded-lg"></div>
                  </div>
                  <div className="font-roboto rounded-l-2xl chat-body-left bg-[#2F3136] min-w-[240px] max-w-[240px] h-[80vh] min-h-[500px] max-h-[850px] chatScroll overflow-y-scroll shadow-right">
                    <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px] mt-4">
                      Servers
                    </div>
                    <div
                      onClick={() =>
                        !publicRoom && handleServerChange("public")
                      }
                      className={` public-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                        publicRoom
                          ? "bg-opacity-30"
                          : "bg-opacity-0 hover:bg-opacity-10"
                      }  rounded-md m-3 cursor-pointer `}
                    >
                      <p className={`p-1 font-roboto`}> # public</p>
                    </div>

                    <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px]">
                      Help
                    </div>
                    <div
                      onClick={() => setViewCommands(!viewCommands)}
                      className={` flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 rounded-md m-3 cursor-pointer bg-opacity-0 hover:bg-opacity-10 `}
                    >
                      <p className="text-md p-1"> # commands</p>
                    </div>
                    <div className="z-10">
                      {joinServer && <JoinServer socket={socket} />}
                    </div>
                    {viewCommands && (
                      <div className="flex flex-col ">
                        {viewCommands &&
                          commands.map((cmd) => {
                            if (!cmd.includes("$")) {
                              return (
                                <div
                                  className={`text-xl mb-2 mt-2 text-white flex items-center justify-center bg-[#6482d0] text-center ${
                                    isMobile ? "mx-2" : "ml-3"
                                  } `}
                                >
                                  {cmd}
                                </div>
                              );
                            }
                            return (
                              <div className="justify-items-center ml-2 flex flex-col items-start justify-center">
                                <div className="text-[#6482d0] text-start text-lg ">
                                  {cmd.split(" ").slice(0, 1)}
                                </div>{" "}
                                <div className="text-[16px] text-gray-200 text-start mb-2">
                                  {cmd.split(" ").slice(1).join(" ")}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {windowWidth <= 890 && (
              <div
                onClick={() => handleDoubleRevealChat("left")}
                className="chat-body-left-stub px-2 min-w-[10px] h-[100%] rounded-l-2xl flex items-center justify-center text-white text-[20px] cursor-pointer"
              >
                <div className="h-[30px] w-[3px] bg-[#d8dade] rounded-lg"></div>
              </div>
            )}
            <div
              onClick={() => handleDoubleRevealChat("center")}
              className={`chat-header bg-[#36393F] rounded-2xl w-[100%] h-[100%] min-w-[${
                windowWidth - 74
              }px] flex justify-center items-center text-white ${
                windowWidth <= 890 && ""
              }`}
            >
              <TryDemo />
            </div>

            {windowWidth > 890 ? (
              <div className="font-roboto chat-body-right bg-[#2F3136] min-w-[240px] h-[100%] rounded-r-2xl">
                <div className="draftbot-online">
                  <p className="font-roboto text-gray-400 text-sm text-bold mt-4 ml-4">
                    DRAFTBOT - 1
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="profile-icon relative">
                      <ProfilePic image={RobotFaceImage} icon={true} />

                      {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                    </div>
                    <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                      <p className="font-opensans">Draft Bot</p>
                      <div className="flex justify-center items-center font-opensans ml-[4px] mr-[1px] bg-[#5b66ed] px-[5px] py-[0.10px] w-fit h-fit text-[10px] discord-bot-tag">
                        BOT
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              revealChatRight &&
              !revealChatLeft && (
                <div className="absolute right-0 top-0 flex items-end ">
                  <div className=" font-roboto chat-body-right bg-[#2F3136] min-w-[240px] h-[80vh] min-h-[500px] max-h-[850px] shadow-left rounded-r-2xl">
                    <div className="draftbot-online">
                      <p className="font-roboto text-gray-400 text-sm text-bold mt-4 ml-4">
                        DRAFTBOT - 1
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="profile-icon relative">
                          <ProfilePic image={RobotFaceImage} icon={true} />

                          {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                        </div>
                        <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                          <p className="font-opensans">Draft Bot</p>
                          <div className="flex justify-center items-center font-opensans ml-[4px] mr-[1px] bg-[#5b66ed] px-[5px] py-[0.10px] w-fit h-fit text-[10px] discord-bot-tag">
                            BOT
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setRevealChatRight(!revealChatRight)}
                    className="chat-body-right-stub pr-2 pl-[11px] min-w-[10px] bg-transparent h-[80vh] min-h-[500px] max-h-[850px] rounded-r-2xl flex items-center justify-center text-white text-[20px] cursor-pointer"
                  ></div>
                </div>
              )
            )}
            {windowWidth <= 890 && (
              <div
                onClick={() => handleDoubleRevealChat("right")}
                className="overflow-hidden chat-body-right-stub pr-2 pl-[11px] min-w-[10px]  h-[100%] rounded-r-2xl flex items-center justify-center text-white text-[20px] cursor-pointer "
              >
                <div className="h-[30px] w-[3px] bg-[#d8dade] rounded-lg"></div>
              </div>
            )}
          </div>
        )}
        {userWantsToJoin && (
          <div className="flex flex-row  w-[90%] h-[100%] justify-center items-center relative bg-[#36393F] rounded-2xl ">
            {windowWidth > 890 ? (
              <div className="font-roboto chat-body-left bg-[#2F3136] min-w-[240px] max-w-[240px] h-[100%] rounded-l-2xl chatScroll overflow-y-scroll">
                <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px] mt-4">
                  Servers
                </div>
                <div
                  onClick={() => !publicRoom && handleServerChange("public")}
                  className={`public-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                    publicRoom
                      ? "bg-opacity-30"
                      : "bg-opacity-0 hover:bg-opacity-10"
                  }  rounded-md m-3 cursor-pointer `}
                >
                  <p className="text-md p-1 font-roboto"> # public</p>
                </div>
                <div
                  onClick={() => publicRoom && handleServerChange("private")}
                  className={`private-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                    !publicRoom
                      ? "bg-opacity-30"
                      : "bg-opacity-0 hover:bg-opacity-10"
                  } rounded-md m-3 cursor-pointer `}
                >
                  <p className="text-md p-1">
                    {" "}
                    # {`${publicRoom ? "create" : `${privateKey}`}`}
                  </p>
                </div>
                <div
                  onClick={() => handleJoinServer()}
                  className={`private-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                    !publicRoom
                      ? "bg-opacity-0 hover:bg-opacity-10"
                      : "bg-opacity-0 hover:bg-opacity-10"
                  } rounded-md m-3 cursor-pointer `}
                >
                  <p className="text-md p-1"> # join</p>
                </div>
                <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px]">
                  Help
                </div>
                <div
                  onClick={() => setViewCommands(!viewCommands)}
                  className={` flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 rounded-md m-3 cursor-pointer bg-opacity-0 hover:bg-opacity-10 `}
                >
                  <p className="text-md p-1"> # commands</p>
                </div>
                <div className="z-10">
                  {joinServer && <JoinServer socket={socket} />}
                </div>
                {viewCommands && (
                  <div className="flex flex-col ">
                    {viewCommands &&
                      commands.map((cmd) => {
                        if (!cmd.includes("$")) {
                          return (
                            <div
                              className={`text-xl mb-2 mt-2 text-white bg-[#6482d0] text-center ml-3`}
                            >
                              {cmd}
                            </div>
                          );
                        }
                        return (
                          <div className="justify-items-center ml-2 flex flex-col items-start justify-center">
                            <div className="text-[#6482d0] text-start text-lg ">
                              {cmd.split(" ").slice(0, 1)}
                            </div>{" "}
                            <div className="text-[16px] text-gray-200 text-start mb-2">
                              {cmd.split(" ").slice(1).join(" ")}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              revealChatLeft &&
              !revealChatRight && (
                <div className="absolute left-0 top-0 flex items-end z-10">
                  <div
                    onClick={() => setRevealChatLeft(!revealChatLeft)}
                    className="chat-body-left-stub px-2 min-w-[10px] h-[80vh] min-h-[500px] max-h-[850px] rounded-l-2xl flex items-center justify-center text-white text-[20px] cursor-pointer"
                  ></div>
                  <div className="font-roboto rounded-l-2xl chat-body-left bg-[#2F3136] min-w-[240px] max-w-[240px] h-[80vh] min-h-[500px] max-h-[850px] chatScroll overflow-y-scroll shadow-right">
                    <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px] mt-4">
                      Servers
                    </div>
                    <div
                      onClick={() =>
                        !publicRoom && handleServerChange("public")
                      }
                      className={`public-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                        publicRoom
                          ? "bg-opacity-30"
                          : "bg-opacity-0 hover:bg-opacity-10"
                      }  rounded-md m-3 cursor-pointer `}
                    >
                      <p className="text-md p-1 font-roboto"> # public</p>
                    </div>
                    <div
                      onClick={() =>
                        publicRoom && handleServerChange("private")
                      }
                      className={`private-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                        !publicRoom
                          ? "bg-opacity-30"
                          : "bg-opacity-0 hover:bg-opacity-10"
                      } rounded-md m-3 cursor-pointer `}
                    >
                      <p className="text-md p-1">
                        {" "}
                        # {`${publicRoom ? "create" : `${privateKey}`}`}
                      </p>
                    </div>
                    <div
                      onClick={() => handleJoinServer()}
                      className={`private-server flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 ${
                        !publicRoom
                          ? "bg-opacity-0 hover:bg-opacity-10"
                          : "bg-opacity-0 hover:bg-opacity-10"
                      } rounded-md m-3 cursor-pointer `}
                    >
                      <p className="text-md p-1"> # join</p>
                    </div>
                    <div className="w-[fit] text-xs font-bold text-gray-400 ml-[4px]">
                      Help
                    </div>
                    <div
                      onClick={() => setViewCommands(!viewCommands)}
                      className={` flex flex-row items-center text-gray-200 w-[fit] bg-gray-400 rounded-md m-3 cursor-pointer bg-opacity-0 hover:bg-opacity-10 `}
                    >
                      <p className="text-md p-1"> # commands</p>
                    </div>
                    <div className="z-10">
                      {joinServer && <JoinServer socket={socket} />}
                    </div>
                    {viewCommands && (
                      <div className="flex flex-col ">
                        {viewCommands &&
                          commands.map((cmd) => {
                            if (!cmd.includes("$")) {
                              return (
                                <div
                                  className={`text-xl mb-2 mt-2 text-white flex items-center justify-center bg-[#6482d0] text-center ${
                                    isMobile ? "mx-2" : "ml-3"
                                  } `}
                                >
                                  {cmd}
                                </div>
                              );
                            }
                            return (
                              <div className="justify-items-center ml-2 flex flex-col items-start justify-center">
                                <div className="text-[#6482d0] text-start text-lg ">
                                  {cmd.split(" ").slice(0, 1)}
                                </div>{" "}
                                <div className="text-[16px] text-gray-200 text-start mb-2">
                                  {cmd.split(" ").slice(1).join(" ")}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            {windowWidth <= 890 && (
              <div
                onClick={() => handleDoubleRevealChat("left")}
                className="chat-body-left-stub px-2 min-w-[10px] bg-[#36393F] h-[100%] rounded-l-2xl flex items-center justify-center text-white text-[20px] cursor-pointer"
              >
                <div className="h-[30px] w-[3px] bg-[#d8dade] rounded-lg"></div>
              </div>
            )}
            <div
              onClick={() => handleDoubleRevealChat("center")}
              id="chat-body"
              className={`chat-body bg-[#36393F] w-[100%] h-[100%] min-w-[${
                windowWidth - 80
              }px] flex flex-col justify-end items-center text-white z-0`}
            >
              <div className="bg-[#2F3136] bg-opacity-50 w-[100%]  ">
                <p className="py-2 date-header  text-center font-opensans">
                  {formatDate()}
                </p>
              </div>
              {/* <div className="bg-white bg-opacity-10 w-[100%] flex items-center justify-center ">
              <p className="absolute py-2 date-header  text-center">
                {formatDate()}
              </p>
            </div> */}
              <div
                ref={chatScrollRef}
                className="overflow-y-auto w-[100%] z-10 chatScroll"
              >
                {publicRoom
                  ? showPublicServerMsg(messageList)
                  : showPrivateServerMsg(privateMessageList)}

                <div className="pt-4 "></div>
              </div>

              <form
                onSubmit={publicRoom ? sendMessage : sendPrivateMessage}
                className="chat-footer mt-0 px-2  min-h-[60px] flex justify-center"
              >
                <input
                  className="font-roboto rounded-lg pl-4 mb-4 w-[100%] bg-[#4A4C52] text-white mx-2"
                  type="text"
                  value={currentMessage}
                  placeholder={`Message ${
                    !userWantsToJoin
                      ? ""
                      : publicRoom
                      ? "#public"
                      : `#room ${privateKey}`
                  }`}
                  autocomplete="off"
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button type="submit" className=""></button>

                {/* <input
                className="font-roboto rounded-lg pl-4 mb-4 w-[100%] bg-[#4A4C52] text-white mx-2"
                type="text"
                value={currentMessage}
                placeholder={`Message ${
                  !userWantsToJoin ? "" : publicRoom ? "#public" : "#private"
                }`}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button type="submit" className=""></button> */}
              </form>
            </div>

            {windowWidth > 890 ? (
              <div className="chat-body-right chatScroll  bg-[#2F3136] min-w-[240px] h-[100%] flex flex-col justify-start items-start overflow-y-scroll rounded-r-2xl ">
                <div className="draftbot-online">
                  <p className="font-roboto text-gray-400 text-sm text-bold mt-4 ml-4">
                    DRAFTBOT - 1
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="profile-icon relative">
                      <ProfilePic image={RobotFaceImage} icon={true} />

                      {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                    </div>
                    <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                      <p className="font-opensans">Draft Bot</p>
                      <div className="flex justify-center items-center font-opensans ml-[4px] mr-[1px] bg-[#5b66ed] px-[5px] py-[0.10px] w-fit h-fit text-[10px] discord-bot-tag">
                        BOT
                      </div>
                    </div>
                  </div>
                </div>
                <div className="people-online mt-4">
                  <p className="font-roboto text-gray-400 text-sm text-bold mt-4 ml-4">
                    ONLINE -{" "}
                    {publicRoom
                      ? allUsers.filter((user) => user[3] === "public").length
                      : allUsers.filter((user) => user[3] === privateKey)
                          .length}
                  </p>
                  <div className="">
                    {publicRoom
                      ? allUsers
                          .filter((user) => {
                            return user[3] === "public";
                          })
                          .map((user) => {
                            return (
                              <div className="flex items-center justify-start mb-[6px]">
                                <div className="profile-icon relative">
                                  <ProfilePic
                                    username={user[1].toUpperCase()}
                                    color={user[2]}
                                    icon={true}
                                  />

                                  {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                                </div>
                                <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                                  <p className="font-opensans">
                                    {user[1].length > 12
                                      ? user[1].slice(0, 12) + "..."
                                      : user[1].length === 1
                                      ? user
                                      : user[1]}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                      : allUsers
                          .filter((user) => {
                            return user[3] === privateKey;
                          })
                          .map((user) => {
                            return user[3] === privateKey ? (
                              <div className="flex items-center justify-start mb-[6px]">
                                <div className="profile-icon relative">
                                  <ProfilePic
                                    username={user[1].toUpperCase()}
                                    color={user[2]}
                                    icon={true}
                                  />

                                  {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                                </div>
                                <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                                  <p className="font-opensans">
                                    {user[1].length > 12
                                      ? user[1].slice(0, 12) + "..."
                                      : user[1].length === 1
                                      ? user
                                      : user[1]}
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          })}
                  </div>
                </div>
              </div>
            ) : (
              revealChatRight &&
              !revealChatLeft && (
                <div className="absolute right-0 top-0 flex items-end ">
                  <div className="chat-body-right chatScroll shadow-left rounded-r-2xl bg-[#2F3136] min-w-[240px] h-[80vh] min-h-[500px] max-h-[850px] shadow-left flex flex-col justify-start items-start overflow-y-scroll ">
                    <div className="draftbot-online">
                      <p className="font-roboto text-gray-400 text-sm text-bold mt-4 ml-4">
                        DRAFTBOT - 1
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="profile-icon relative">
                          <ProfilePic image={RobotFaceImage} icon={true} />

                          {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                        </div>
                        <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                          <p className="font-opensans">Draft Bot</p>
                          <div className="flex justify-center items-center font-opensans ml-[4px] mr-[1px] bg-[#5b66ed] px-[5px] py-[0.10px] w-fit h-fit text-[10px] discord-bot-tag">
                            BOT
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="people-online mt-4">
                      <p className="font-roboto text-gray-400 text-sm text-bold mt-4 ml-4">
                        ONLINE -{" "}
                        {publicRoom
                          ? allUsers.filter((user) => user[3] === "public")
                              .length
                          : allUsers.filter((user) => user[3] === privateKey)
                              .length}
                      </p>
                      <div className="">
                        {publicRoom
                          ? allUsers
                              .filter((user) => {
                                return user[3] === "public";
                              })
                              .map((user) => {
                                return (
                                  <div className="flex items-center justify-start mb-[6px]">
                                    <div className="profile-icon relative">
                                      <ProfilePic
                                        username={user[1].toUpperCase()}
                                        color={user[2]}
                                        icon={true}
                                      />

                                      {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                                    </div>
                                    <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                                      <p className="font-opensans">
                                        {user[1].length > 12
                                          ? user[1].slice(0, 12) + "..."
                                          : user[1].length === 1
                                          ? user
                                          : user[1]}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                          : allUsers
                              .filter((user) => {
                                return user[3] === privateKey;
                              })
                              .map((user) => {
                                return user[3] === privateKey ? (
                                  <div className="flex items-center justify-start mb-[6px]">
                                    <div className="profile-icon relative">
                                      <ProfilePic
                                        username={user[1].toUpperCase()}
                                        color={user[2]}
                                        icon={true}
                                      />

                                      {/* <div className="online-icon right-[12px] bottom-[0px]"></div> */}
                                    </div>
                                    <div className="flex items-center  font-merriweather w-[100%] text-white mt-1">
                                      <p className="font-opensans">
                                        {user[1].length > 12
                                          ? user[1].slice(0, 12) + "..."
                                          : user[1].length === 1
                                          ? user
                                          : user[1]}
                                      </p>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setRevealChatRight(!revealChatRight)}
                    className="chat-body-right-stub pr-2 pl-[11px] min-w-[10px] transparent h-[80vh] min-h-[500px] max-h-[850px] rounded-r-2xl flex items-center justify-center text-white text-[20px] cursor-pointer"
                  ></div>
                </div>
              )
            )}
            {windowWidth <= 890 && (
              <div
                onClick={() => handleDoubleRevealChat("right")}
                className="overflow-hidden chat-body-right-stub pr-2 pl-[11px] min-w-[10px] bg-[#36393F] h-[100%] rounded-r-2xl flex items-center justify-center text-white text-[20px] cursor-pointer "
              >
                <div className="h-[30px] w-[3px] bg-[#d8dade] rounded-lg"></div>
              </div>
            )}
          </div>
        )}{" "}
      </div>
      {windowWidth <= 890 && (
        <div
          className={`pages-indicator mt-2 left-50 flex flex-row items-center justify-center text-white  w-[400px] overflow-hidden  z-10 `}
        >
          <div
            onClick={() => handleDoubleRevealChat("left")}
            className={`w-[8px] h-[8px] cursor-pointer rounded-full mr-2 ${
              revealChatLeft ? "bg-[#d8dade]" : "border-[#d8dade] border-2 "
            }`}
          ></div>
          <div
            onClick={() => handleDoubleRevealChat("center")}
            className={`w-[8px] h-[8px] cursor-pointer ${
              !revealChatLeft && !revealChatRight
                ? "bg-[#d8dade]"
                : "border-[#d8dade] border-2 "
            }  rounded-full `}
          ></div>
          <div
            onClick={() => handleDoubleRevealChat("right")}
            className={`w-[8px] h-[8px] cursor-pointer  rounded-full ml-2 ${
              revealChatRight ? "bg-[#d8dade]" : "border-[#d8dade] border-2 "
            }`}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Chat;
