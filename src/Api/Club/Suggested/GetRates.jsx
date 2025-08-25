import { axiosInstance } from "../../axiosInstance";

export const GetRates = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/get_stars_video/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Get Rates videos successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get Rates videos failed");
  }
};
