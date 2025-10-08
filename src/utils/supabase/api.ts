import axios from "axios";

// Flask backend URL (change if deployed)
const API_BASE_URL = "http://127.0.0.1:5000";

// Define all API routes
export const api = {
  getAllPatients: async () => {
    const res = await axios.get(`${API_BASE_URL}/patients`);
    return res.data;
  },

  getPatient: async (pid: number) => {
    const res = await axios.get(`${API_BASE_URL}/patient/${pid}`);
    return res.data;
  },

  addPatient: async (data: { name: string; age: number; ward: string }) => {
    const res = await axios.post(`${API_BASE_URL}/add_patient`, data);
    return res.data;
  },

  editPatient: async (pid: number, data: any) => {
    const res = await axios.put(`${API_BASE_URL}/edit_patient/${pid}`, data);
    return res.data;
  },

  deletePatient: async (pid: number) => {
    const res = await axios.delete(`${API_BASE_URL}/delete_patient/${pid}`);
    return res.data;
  },

  getVitals: async (pid: number) => {
    const res = await axios.get(`${API_BASE_URL}/get_vitals/${pid}`);
    return res.data;
  },
};
