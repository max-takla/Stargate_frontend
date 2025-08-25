import { axiosInstance } from "../../axiosInstance";

export const GetAllSports = async () => {
  try {
    const response = await axiosInstance.get("sports", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "successful in fetch all sports");
      return response;
    }
  } catch (error) {
    console.log(error, "faild in fetch all sports");
  }
};
