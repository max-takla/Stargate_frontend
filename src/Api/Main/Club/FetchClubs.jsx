import { axiosInstance } from "../../axiosInstance";

export const FetchClubs = async () => {
  try {
    const response = await axiosInstance.get(
      "/clubs/index",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response.data, "fetch all clubs");
      return response;
    }
  } catch (error) {
    console.log(error, "fetch all clubs failed");
  }
};
