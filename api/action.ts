"use client";
import axios from "axios";

const baseURL = "http://localhost:5000";

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


// Sign-up request
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

export const signin = async (body: any) => {
  try {
    const response = await instance.post("/auth/signin", body);
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken); 
    return response.data; 
  } catch (error: any) {
    throw error; 
  }
};

export const getProfile = async() => {
  try {
    const response = await instance.get("/auth/profile")
    return response.data;
  } catch(error: any) {
    throw error;
  } 
} 

export const updateProfile = async(data: any) => {
  try {
    const response = await instance.post("/auth/update-profile")
    return response.data;
  } catch(error: any) {
    throw error;
  } 
} 
