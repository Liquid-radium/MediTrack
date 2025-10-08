import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  phoneNumber: string;
  email: string;
  role: string;
  department: string;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user profile
const defaultUser: UserProfile = {
  name: 'Dr. Sarah Johnson',
  phoneNumber: '+1 (555) 123-4567',
  email: 'sarah.johnson@healthconnect.com',
  role: 'Senior Physician',
  department: 'Cardiology'
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
