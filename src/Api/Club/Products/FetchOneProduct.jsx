import { axiosInstance } from "../../axiosInstance";

export const FetchOneProduct = async (id) => {
  try {
    const response = await axiosInstance.get(
      `products/show/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Get one product successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Get one product failed");
  }
};
