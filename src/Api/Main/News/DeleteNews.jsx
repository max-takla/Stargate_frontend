import { axiosInstance } from "../../axiosInstance";


export const DeleteNews = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `del_article`,parseInt(id),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "delete article successful");
      return response;
    }
  } catch (error) {
    console.log(error, "delete article failed");
  }
};
