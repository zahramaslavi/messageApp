import { generalApiClient } from "./apiClient";
// import { MoodDataI } from "@/models/moodData";

export const fetchUsers = async () => {
  try {
    console.log("fetchUsers");
    const res = await generalApiClient("/general");
    console.log("fetchUsers res", res);
    return res.data;
  } catch (error) {
    throw error;
  }
}
