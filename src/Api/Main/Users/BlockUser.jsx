import { axiosInstance } from "../../axiosInstance";

export const BlockUser = async (banDate) => {
  try {
    const response = await axiosInstance.post(
      "/update_ban_date_user",
      banDate,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "update ban date successful");
      return response;
    }
  } catch (error) {
    console.log(error, "update ban date failed");
  }
};
