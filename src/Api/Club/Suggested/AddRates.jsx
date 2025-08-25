import { axiosInstance } from "../../axiosInstance";

export const AddRates = async (data) => {
  try {
    const response = await axiosInstance.post("/addevaluation", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "Add evaluation successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Add evaluation failed");
  }
};
