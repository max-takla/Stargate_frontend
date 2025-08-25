import { axiosInstance } from "../axiosInstance";

export const GetNote= async () => {
  try {
    const response = await axiosInstance.get("/getnotes", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "successful in get notification ");
      return response;
    }
  } catch (error) {
    console.log(error, "failed in get notification");
  }
};
