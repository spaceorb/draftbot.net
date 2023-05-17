import { menuOpenState } from "../atoms/index";
import { useRecoilValue } from "recoil";
import { Link, useLocation } from "react-router-dom";

const NormalMenu = () => {
  const location = useLocation().pathname;

  const handleCurrentLinkStyle = () => {
    console.log("location", location);
    if (location === "/") {
      return "";
    } else if (location === "/skills") {
      return "translate-x-[7rem]";
    } else if (location === "/projects") {
      return "translate-x-[14rem]";
    } else if (location === "/contact") {
      return "translate-x-[21rem]";
    }
  };
  const scrollToView = (section) => {
    const element = document.getElementById(section);
    console.log("SECTION", section);
    console.log("Element", element);

    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="absolute top-[20px] flex flex-row justify-between items-center show-navbar  w-[80%] h-auto max-w-[1100px]">
      <div className=" mx-4 duration-500 cursor-pointer text-white ">
        <h3>DraftBot.Pro</h3>
      </div>
      <ul className="flex  show-navbar nav-list items-center">
        <Link
          to="/"
          className="nav-item mx-4 duration-500 cursor-pointer bg-opacity-0"
        >
          <div
            onClick={() => scrollToView("chat-section")}
            className="nav-link"
          >
            {" "}
            Demo{" "}
          </div>
          {/* <div className="active"></div> */}
        </Link>
        <Link
          to="/skills"
          className="nav-item mx-4  duration-500 cursor-pointer"
        >
          <div className="nav-link"> Commands </div>
          {/* <div className="active"></div> */}
        </Link>
        <Link
          to="/projects"
          className="nav-item mx-4  duration-500 cursor-pointer"
        >
          <div className="nav-link"> Documentation </div>
          {/* <div className="active"></div> */}
        </Link>
        <Link
          to="/contact"
          className="nav-item mx-4 duration-500 cursor-pointer"
        >
          <div className="nav-link bg-[#0b8fdb] rounded-lg p-[8px] px-[10px]">
            {" "}
            Invite To Server{" "}
          </div>
          {/* <div className="active"></div> */}
        </Link>
        <div className={`nav-active ${handleCurrentLinkStyle()}`}></div>
      </ul>
    </div>
  );
};

const NavBar = () => {
  const menuState = useRecoilValue(menuOpenState);

  return (
    <div className="flex justify-center">
      <div
        className={`${
          menuState ? "block" : "absolute"
        } md:flex md:items-center  w-full`}
      ></div>
      {/* <div className="flex items-center justify-between">
        hiidsfisfkdafskldfasjkl
      </div> */}
      <NormalMenu />
    </div>
  );
};

export default NavBar;
