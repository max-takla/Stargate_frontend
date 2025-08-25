import { axiosInstance } from "../../axiosInstance";

export const GetInformation = async (id) => {
  try {
    const response = await axiosInstance.get(`clubs/${parseInt(id)}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "successful in fetch club information");
      return response;
    }
  } catch (error) {
    console.log(error, "faild in fetch club information");
  }
};
