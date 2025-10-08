import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

// Define your backend base URL here
const API_BASE_URL = 'http://127.0.0.1:5000'; // or your deployed Flask backend URL

export interface Patient {
  patient_id: number;
  name: string;
  age: number;
  ward: string;
  status?: 'critical' | 'stable' | 'recovering' | 'discharged';
  vitals?: {
    heartRate?: number;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    temperature?: number;
    oxygenSat?: number;
  };
  created_at?: string;
  updated_at?: string;
  discharged_at?: string;
}

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  addPatient: (data: Omit<Patient, 'patient_id'>) => Promise<void>;
  updatePatient: (id: number, updates: Partial<Patient>) => Promise<void>;
  getPatient: (id: number) => Promise<Patient | undefined>;
  deletePatient: (id: number) => Promise<void>;
  refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/patients`);
      setPatients(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  // Add new patient
  const addPatient = async (data: Omit<Patient, 'patient_id'>) => {
    try {
      await axios.post(`${API_BASE_URL}/add_patient`, data);
      await fetchPatients(); // refresh after adding
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add patient');
    }
  };

  // Update patient
  const updatePatient = async (id: number, updates: Partial<Patient>) => {
    try {
      await axios.put(`${API_BASE_URL}/edit_patient/${id}`, updates);
      await fetchPatients(); // refresh after update
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update patient');
    }
  };

  // Get single patient by ID
  const getPatient = async (id: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patient/${id}`);
      return response.data as Patient;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get patient');
      return undefined;
    }
  };

  // Delete patient
  const deletePatient = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_patient/${id}`);
      await fetchPatients();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete patient');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <PatientContext.Provider
      value={{
        patients,
        loading,
        error,
        addPatient,
        updatePatient,
        getPatient,
        deletePatient,
        refreshPatients: fetchPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}

