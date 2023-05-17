const ProfilePic = ({ image, username, color, icon }) => {
  console.log("COLOR", color);
  return (
    <div
      className={`${
        image ? "gradient-bg" : ""
      } flex justify-start items-start rounded-full ml-4 mt-2 mr-3 overflow-hidden m-h-[42px] m-w-[42px] `}
      style={{
        backgroundColor: image ? undefined : color,
        maxHeight: "42px",
        maxWidth: "42px",
      }}
    >
      {!username ? (
        <img
          src={image}
          alt="javascript"
          className=" max-h-[42px] max-w-[42px] z-0"
        />
      ) : (
        <div className="flex text-white justify-center items-center max-h-[42px] max-w-[42px] min-h-[42px] min-w-[42px] z-0">
          {username[0]}
        </div>
      )}

      {icon && (
        <div className="online-icon right-[5px] -bottom-[1px] z-10"></div>
      )}
    </div>
  );
};

export default ProfilePic;
