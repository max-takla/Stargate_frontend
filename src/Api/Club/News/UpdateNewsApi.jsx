import { axiosInstance } from "../../axiosInstance";

export const UpdateNewsApi = async (info) => {
  try {
    const response = await axiosInstance.post(
      "upinfoarticle",
      info,
      {
        headers: {
            "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response) {
      console.log(response, "update news successful");
      return response;
    }
  } catch (error) {
    console.log(error, "update news failed");
  }
};
