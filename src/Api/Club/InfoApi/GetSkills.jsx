import { axiosInstance } from "../../axiosInstance";

export const GetSkills = async () => {
  try {
    const response = await axiosInstance.get("show_skill", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log(response, "successful in fetch all skills");
      return response;
    }
  } catch (error) {
    console.log(error, "faild in fetch all skills");
  }
};
