import axiosClient from "./axios.client";

const roleApi = {
  signIn: (body) => {
    const url = "/Users/SignIn";
    return axiosClient.post(url, body);
  },

  getAll: async () => {
    const url = "/Role/GetAllRoles";
    return axiosClient.get(url);
  }
};

export default roleApi;
