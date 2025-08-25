import { axiosInstance } from "../../axiosInstance";

export const FetchProducts = async () => {
  try {
    const response = await axiosInstance.get(
      "products/index",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Get all products successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get all products failed");
  }
};
