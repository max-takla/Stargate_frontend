import { axiosInstance } from "../../axiosInstance";

export const GetAllLeagues = async () => {
  try {
    const response = await axiosInstance.get("all_leagues", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "successful in fetch all leagues");
      return response;
    }
  } catch (error) {
    console.log(error, "faild in fetch all leagues");
  }
};
