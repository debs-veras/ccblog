import axios, { type AxiosInstance } from "axios";

const URL_API = import.meta.env.VITE_URL_API;

const getAxios = (timeout: number = 600000) => {
  const token = localStorage.getItem("token");
  const instance: AxiosInstance = axios.create({
    baseURL: URL_API,
    timeout: timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};

export default getAxios;
