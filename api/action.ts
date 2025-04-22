"use client";
import { useAlert } from "@/context/AlertProvider";
import { message } from "antd";
import axios from "axios";

const baseURL = "http://localhost:5000";
import { useRouter } from "next/navigation";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000000,
});

instance.interceptors.request.use(
  async (config) => {
    const tokenString = localStorage.getItem("token");

    if (tokenString) {
      config.headers.Authorization = "Bearer " + tokenString;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
    config.headers["Accept-Language"] = "mn-MN";

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      message.error("Дахин нэвтрэнэ үү", 5, () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const signin = async (body: any) => {
  try {
    const response = await instance.post("/auth/signin", body);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const signup = async (body: any) => {
  try {
    const response = await instance.post("/auth/signup", body);
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getPollForTest = async (id: string) => {
  try {
    const response = await instance.get(`/polls/test/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default instance;

export const getProfile = async () => {
  try {
    const response = await instance.get("/auth/profile");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (data: any) => {
  try {
    const response = await instance.post("/auth/change-password", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const updateProfile = async (data: any) => {
  try {
    const response = await instance.post("/auth/update-profile", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteProfile = async () => {
  try {
    const response = await instance.post("/auth/delete-account");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const checkUserExists = async (username: string) => {
  try {
    const response = await instance.get(
      `/auth/check-user?username=${username}`
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createPoll = async (data: any) => {
  try {
    const response = await instance.post("/polls", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updatePoll = async (id: string, data: any) => {
  try {
    const response = await instance.put(`/polls/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllPoll = async () => {
  try {
    const response = await instance.get("/polls");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllPollBasic = async () => {
  try {
    const response = await instance.get("/polls/all");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getPollById = async (id: string) => {
  try {
    const response = await instance.get(`/polls/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getStatById = async (id: string) => {
  try {
    const response = await instance.get(`/polls/stats/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deletePollById = async (id: string) => {
  try {
    const response = await instance.delete(`/polls/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createAnswer = async (data: any) => {
  try {
    const response = await instance.post(`/answers`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const recordFailedAttendance = async (id: string) => {
  try {
    const response = await instance.post(`/polls/failed-attendance/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createEmptyAnswer = async () => {
  try {
    const response = await instance.post(`/answers/empty`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAnsweredPolls = async () => {
  try {
    const response = await instance.get(`/answers/my-polls`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAnsweredPollDetail = async (id: string) => {
  try {
    const response = await instance.get(`/answers/poll/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
