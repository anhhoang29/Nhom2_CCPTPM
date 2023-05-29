import axiosClient from "./axios.client";

const userApi = {
  signIn: (body) => {
    const url = "/Users/SignIn";
    return axiosClient.post(url, body);
  },
  signUp: async (body) => {
    const url = "/Users/SignUp";
    return axiosClient.post(url, body);
  },
  update: async (username, body) => {
    const url = `/Users/update/${username}`;
    return axiosClient.put(url, body);
  },
  forgotPassword: (body) => {
    const url = "/Users/ForgotPassword";
    return axiosClient.post(url, body);
  },
  getAllUser: async () => {
    const url = "/Users/GetAllUsers";
    let response = await axiosClient.get(url);
   // const result=data.response.data
    return response;
  },

  addRoles: async (userId, roleName) => {
    const url = `/Role/AddRole/${userId}/${roleName}`;
    const http = axiosClient;
    http.defaults.timeout= 1000;
    return http.post(url);
  },

  deleteUser: (id) => {
    const url = `Users/${id}`;
    return axiosClient.delete(url);
  }
};

export default userApi;
