import axiosClient from "./axios.client";

const userApi = {
  signIn: (body) => {
    const url = "/Users/SignIn";
    return axiosClient.post(url, body);
  },
  signUp: (body) => {
    const url = "/Users/SignUp";
    return axiosClient.post(url, body);
  },
  forgotPassword: (body) => {
    const url = "/Users/ForgotPassword";
    return axiosClient.post(url, body);
  },
};

export default userApi;
