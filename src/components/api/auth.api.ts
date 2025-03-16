import axios from "axios";

interface RegisterPayload {
 username : string;
 email: string;
 password: string;

}

interface RegisterResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}


interface LoginPayload {
  identifier: string;
  password: string;
}
const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    console.log("data", data);
    const response = await axios.post<RegisterResponse>(
      "http://localhost:1337/api/auth/local/register",
      data
    );
    return response.data;
  },
  login: async (data: LoginPayload) => {
    console.log("data", data);
    const response = await axios.post(
      "http://localhost:1337/api/auth/local",
      data
    );
    return response.data;
  },
};


export default authApi;

