import { axiosInstance } from "../../axiosInstance";



export const DeleteVideo = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `delvideo/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "delete video successful");
      return response;
    }
  } catch (error) {
    console.log(error, "delete video failed");
  }
};
