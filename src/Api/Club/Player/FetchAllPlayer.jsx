import { axiosInstance } from "../../axiosInstance";

export const FetchAllPlayer = async () => {
  try {
    const response = await axiosInstance.get("showplayers", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "Get all players successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get players failed");
  }
};
