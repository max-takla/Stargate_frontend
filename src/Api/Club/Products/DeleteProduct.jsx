import { axiosInstance } from "../../axiosInstance";



export const DeleteProduct = async (id) => {
  try {
    const response = await axiosInstance.post(
      'products/delete',parseInt(id),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "delete product successful");
      return response;
    }
  } catch (error) {
    console.log(error, "delete product failed");
  }
};
