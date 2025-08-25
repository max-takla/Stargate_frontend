import axios from "axios";

export const RegisterApi = async (info) => {
  try {
    const response = await axios.post(
      "https://dashboard.stars-gate.com/api/register",
      info,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Register successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Register failed");
  }
};
