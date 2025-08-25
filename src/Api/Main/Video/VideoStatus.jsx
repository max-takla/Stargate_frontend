import { axiosInstance } from "../../axiosInstance";

export const VideoStatus = async (status) => {
  try {
    const response = await axiosInstance.post(
      "/video_status",
      status,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "update video_status successful");
      return response;
    }
  } catch (error) {
    console.log(error, "update video_status failed");
  }
};
