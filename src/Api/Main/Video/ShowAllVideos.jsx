import { axiosInstance } from "../../axiosInstance";

export const ShowAllVideos = async () => {
  try {
    const response = await axiosInstance.get("/show_all_video", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  if (response) {
      console.log(response, "Fetch all videos successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Fetch all videos failed");
  }
};
