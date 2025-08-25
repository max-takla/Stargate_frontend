import { axiosInstance } from "../../axiosInstance";

export const RequestApi = async (info) => {
  try {
    const response = await axiosInstance.post("/request_join", info, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "request to join successful");
      return response;
    }
  } catch (error) {
    console.log(error, "request to join failed");
  }
};
