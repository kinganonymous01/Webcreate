import axios from "axios";

const BASE_URL = "/api/build";

export async function sendBuildRequest(data: any) {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network error. Backend may be down.");
    }
  }
}
