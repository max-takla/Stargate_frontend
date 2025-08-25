import { axiosInstance } from "../../axiosInstance";

export const FetchNews = async () => {
  try {
    const response = await axiosInstance.get(
      "/show_articles",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response.data, "fetch all news");
      return response;
    }
  } catch (error) {
    console.log(error, "fetch all news failed");
  }
};
