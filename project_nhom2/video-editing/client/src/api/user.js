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
  getAllUser: () => {
    const url = "/Users/GetAllUsers";
    return axiosClient.get(url);
  },

  addRoles: (userId, roleName) => {
    const url = `/Users/AddRole/${userId}/${roleName}`;
    return axiosClient.post(url);
  },

  deleteUser: (id) => {
    const url = `Users/${id}`;
    return axiosClient.delete(url);
  }
};

export default userApi;
