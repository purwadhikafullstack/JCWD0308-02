import axios from 'axios';

export const fetchUsers = async () => {
  const response = await axios.get(`http://localhost:8000/api/users`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await axios.put(`http://localhost:8000/api/users/${id}`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const createUser = async (userData: any) => {
    const response = await axios.post(`http://localhost:8000/api/users`, userData, {
      withCredentials: true,
    });
    return response.data;
  };

  export const deleteUser = async (id: string) => {
    const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  };