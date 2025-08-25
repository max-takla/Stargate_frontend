import { axiosInstance } from "../../axiosInstance";

export const FetchPlayerVideos = async (id) => {
  try {
    const response = await axiosInstance.get(
      "show_player_videos",
      { id: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "successful in fetch player videos");
      return response;
    }
  } catch (error) {
    console.log(error, "faild in fetch player videos");
  }
};
