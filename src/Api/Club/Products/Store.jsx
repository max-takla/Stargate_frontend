import { axiosInstance } from "../../axiosInstance";

export const Store = async (info) => {
  try {
    const response = await axiosInstance.post(
      "products/store",
      info,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response) {
      console.log(response, "Add new product successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Add new product failed");
  }
};
