import axios from "axios";

export const LoginApi = async (info) => {
  try {
    const response = await axios.post(
      "https://dashboard.stars-gate.com/api/login",
      info,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response, "Login successful");
      return response;
    }
  } catch (error) {
    console.log(error, "Login failed");
  }
};
