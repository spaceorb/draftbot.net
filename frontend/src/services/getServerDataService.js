import axios from "axios";
let URL;
if (process.env.NODE_ENV === "production") {
  URL = "https://draftbot.net/api/endpoint";
} else {
  URL = "http://localhost:3001/api/endpoint";
}

const getServerData = async () => {
  try {
    const response = await axios
      .get(URL)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("servers: A", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
};

export { getServerData };
