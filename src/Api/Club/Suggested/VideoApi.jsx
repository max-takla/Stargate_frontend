import { axiosInstance } from "../../axiosInstance";

export const VideoApi = async (id) => {
  try {
    const response = await axiosInstance.get(
      'suggested_videos',
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Get Suggestions videos successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get Suggestions videos failed");
  }
};
