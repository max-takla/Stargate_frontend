
import { axiosInstance } from "../axiosInstance";

export const LogoutApi = async () => {
  try {
    const response = await axiosInstance.post(
      "/logout",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Logout successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Logout failed");
  }
};
