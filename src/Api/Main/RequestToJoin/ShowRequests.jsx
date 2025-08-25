import { axiosInstance } from "../../axiosInstance";

export const ShowRequests = async () => {
  try {
    const response = await axiosInstance.get("/show_request_join", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  if (response) {
      console.log(response, "Fetch requests successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Fetch requests failed");
  }
};
