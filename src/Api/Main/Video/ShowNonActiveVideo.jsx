import { axiosInstance } from "../../axiosInstance";

export const ShowNonActiveVideo = async () => {
  try {
    const response = await axiosInstance.get("/show_nonact_video", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  if (response) {
      console.log(response, "Fetch non active videos successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Fetch non active videos failed");
  }
};
