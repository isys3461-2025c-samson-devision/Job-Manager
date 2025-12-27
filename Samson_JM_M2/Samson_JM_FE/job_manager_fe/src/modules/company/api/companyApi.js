import axios from "axios";

const BASE_URL = "http://localhost:8080/api/company";

export const getMyCompany = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateMyCompany = async (payload) => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.patch(`${BASE_URL}/me`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
