import { axiosInstance } from "../../axiosInstance";

export const IncreaseVideoViews = async (id) => {
  try {
    const response = await axiosInstance.post(
      "increase_views",
      {video_id:id},
      {
        headers: {
           "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "successful in increase_views");
      return response;
    }
  } catch (error) {
    console.log(error, "failed in increase_views");
  }
};
