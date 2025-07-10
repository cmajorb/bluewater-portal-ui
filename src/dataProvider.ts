// src/dataProvider.ts
import { DataProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = "https://bluewater-portal.fly.dev";

export const customDataProvider: DataProvider = {
  getList: async ({ resource }) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_URL}/${resource}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      data: response.data,
      total: response.data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_URL}/${resource}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { data: response.data };
  },

  create: async ({ resource, variables }) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(`${API_URL}/${resource}`, variables, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { data: response.data };
  },

  update: async ({ resource, id, variables }) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(`${API_URL}/${resource}/${id}`, variables, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { data: response.data };
  },

  deleteOne: async ({ resource, id }) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(`${API_URL}/${resource}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { data: response.data };
  },
};
