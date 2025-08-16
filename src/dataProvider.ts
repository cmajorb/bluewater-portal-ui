// src/dataProvider.ts
import { DataProvider, HttpError } from "@refinedev/core";
import axios from "axios";

const API_URL = "https://bluewater-portal.fly.dev";

export const customDataProvider: DataProvider = {
  getApiUrl: () => API_URL,
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const token = localStorage.getItem("access_token");
    const params: Record<string, any> = {};

    if (pagination) {
      // Refine's pagination is 1-based; backend expects 1-based
      params.page = pagination.current;
      params.page_size = pagination.pageSize;
    }

    if (sorters && sorters.length > 0) {
      // Use the first sorter for simplicity
      const sorter = sorters[0];
      params.sort_by = sorter.field;
      params.sort_dir = (sorter.order ?? "asc").toUpperCase();
    }

    // Pass filters as query params (generic mapping field -> value)
    if (filters && filters.length > 0) {
      for (const f of filters) {
        if ("field" in f && "value" in f && f.value !== undefined) {
          params[String(f.field)] = f.value as any;
        }
      }
    }

    // Build query string with repeated keys for arrays (e.g., tag_ids=1&tag_ids=2)
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const url = `${API_URL}/${resource}` + (meta?.path ? `/${meta.path}` : "") + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      data: response.data,
      total:
        Number(response.headers["x-total-count"]) ||
        Number((response.headers as any)["X-Total-Count"]) ||
        (Array.isArray(response.data) ? response.data.length : 0),
    };
  },

  custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    const token = localStorage.getItem("access_token");

    const response = await axios.request({
      url: `${API_URL}${url}`,
      method,
      data: payload,
      params: query,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    return {
      data: response.data,
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
