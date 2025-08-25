
import { axiosInstance } from "../../axiosInstance";

export const FetchOneUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/show_player_info",data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response.data, "fetch one user successful");
      return response;
    }
  } catch (error) {
    console.log(error, "fetch one user failed");
  }
};
