import { axiosInstance } from "../../axiosInstance";

export const FetchCategories = async () => {
  try {
    const response = await axiosInstance.get(
      "category/index",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Get all categories successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get all categories failed");
  }
};
