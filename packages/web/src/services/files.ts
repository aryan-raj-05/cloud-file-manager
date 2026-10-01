import axios from "axios";

const baseUrl = `http://localhost:3001`;

export const getAllFiles = async () => {
  const response = await axios.get(`${baseUrl}/api/files`, {
    withCredentials: true,
  });
  return response.data;
};
