
import { axiosInstance } from "../axiosInstance";

export const StoreToken = async (token) => {
  try {
    const response =await axiosInstance.post(
      "/store-token",
      token,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Store Token successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Store Token failed");
  }
};