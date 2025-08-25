import { axiosInstance } from "../../axiosInstance";

export const GetAllCountries = async () => {
  try {
    const response = await axiosInstance.get("all_countries", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "successful in fetch all countries");
      return response;
    }
  } catch (error) {
    console.log(error, "faild in fetch all countries");
  }
};
