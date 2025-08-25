import { axiosInstance } from "../axiosInstance";

export const AddClubApi = async (info) => {
  try {
    const response = await axiosInstance.post(
      "/clubs/store",
      info,
      {
        headers: {
            "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response) {
      console.log(response, "Add club successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Add club failed");
  }
};
