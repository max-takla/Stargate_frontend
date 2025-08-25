
import { axiosInstance } from "../../axiosInstance";

export const FetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get(
      "/show_all_user",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response.data, "fetch all users successful");
      return response;
    }
  } catch (error) {
    console.log(error, "fetch all users  failed");
  }
};
