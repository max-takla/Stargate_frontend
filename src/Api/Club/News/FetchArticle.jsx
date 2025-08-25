import { axiosInstance } from "../../axiosInstance";

export const FetchArticle = async (id) => {
  try {
    const response = await axiosInstance.get(`view_article/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "Get one news successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get one news failed");
  }
};
