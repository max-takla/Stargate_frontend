import { axiosInstance } from "../../axiosInstance";

export const FetchOurNews = async (id) => {
  try {
    const response = await axiosInstance.get(`club_articles/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "Get our news successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get our news failed");
  }
};
