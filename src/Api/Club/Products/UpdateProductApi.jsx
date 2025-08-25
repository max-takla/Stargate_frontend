import { axiosInstance } from "../../axiosInstance";

export const UpdateProductApi = async (product,id) => {
  try {
    const result = await axiosInstance.post(`products/update/${id}`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (result) {
      console.log("updated product done", result);
      return result;
    } else {
      console.error("no product found");
      return null;
    }
  } catch (error) {
    console.log("error in update product", error);
  }
};
