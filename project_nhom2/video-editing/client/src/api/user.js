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
  forgotPassword: (body) => {
    const url = "/Users/ForgotPassword";
    return axiosClient.post(url, body);
  },
  getAllUser: async () => {
    const url = "/Users/GetAllUsers";
    let response= await axiosClient.get(url);
   // const result=data.response.data
    return response;
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
