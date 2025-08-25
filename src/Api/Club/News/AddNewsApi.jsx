import { axiosInstance } from "../../axiosInstance";

export const AddNewsApi = async (info) => {
  try {
    const response = await axiosInstance.post(
      "addarticle",
      info,
      {
        headers: {
            "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response) {
      console.log(response, "Add new news successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Add new news failed");
  }
};
