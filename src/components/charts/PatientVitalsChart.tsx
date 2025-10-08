import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { usePatients } from '../../contexts/PatientContext';

// Mock vitals history data (simulating time-series data)
const generateVitalsHistory = (vitals: any) => {
  if (!vitals) return [];
  
  return [
    { time: '00:00', ...vitals, heartRate: vitals.heartRate - 3, oxygenSat: vitals.oxygenSat - 1 },
    { time: '04:00', ...vitals, heartRate: vitals.heartRate - 5, oxygenSat: vitals.oxygenSat - 2 },
    { time: '08:00', ...vitals, heartRate: vitals.heartRate + 1, oxygenSat: vitals.oxygenSat },
    { time: '12:00', ...vitals, heartRate: vitals.heartRate + 3, oxygenSat: vitals.oxygenSat + 1 },
    { time: '16:00', ...vitals, heartRate: vitals.heartRate, oxygenSat: vitals.oxygenSat },
    { time: '20:00', ...vitals, heartRate: vitals.heartRate - 2, oxygenSat: vitals.oxygenSat - 1 }
  ];
};

export function PatientVitalsChart() {
  const { getPatient } = usePatients();
  const [patientId, setPatientId] = useState('PT001');
  const [inputValue, setInputValue] = useState('PT001');
  
  const handleSearch = () => {
    const upperCaseInput = inputValue.toUpperCase();
    const patient = getPatient(upperCaseInput);
    if (patient && patient.vitals) {
      setPatientId(upperCaseInput);
    }
  };

  const patient = getPatient(patientId);
  const data = patient?.vitals ? generateVitalsHistory(patient.vitals) : [];
  const patientName = patient?.name || 'Unknown Patient';

  return (
    <div>
      {/* Patient ID Input */}
      <div className="mb-6 flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter Patient ID (e.g., PT001, PT002, PT003)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border-healthcare-light focus:border-healthcare-secondary"
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-healthcare-secondary hover:bg-healthcare-primary"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Patient Info */}
      <div className="mb-4 p-3 bg-healthcare-light/30 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Patient</p>
            <p className="font-semibold text-healthcare-primary">{patientName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ID</p>
            <p className="font-semibold text-healthcare-primary">{patientId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-semibold text-healthcare-primary">Today</p>
          </div>
        </div>
      </div>

      {/* Vitals Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#B6E3E9" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#095256', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#095256', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #B6E3E9',
                borderRadius: '8px',
                color: '#095256'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  heartRate: 'Heart Rate (bpm)',
                  oxygenSat: 'Oxygen Saturation (%)'
                };
                return [value, labels[name] || name];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  heartRate: 'Heart Rate',
                  oxygenSat: 'O₂ Saturation'
                };
                return labels[value] || value;
              }}
            />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#087F8C"
              strokeWidth={2}
              dot={{ fill: '#087F8C', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="oxygenSat"
              stroke="#98C1B4"
              strokeWidth={2}
              dot={{ fill: '#98C1B4', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Vitals Summary */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        <div className="p-3 bg-background border border-healthcare-light rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
          <p className="font-semibold text-healthcare-secondary">{data[data.length - 1].heartRate} bpm</p>
        </div>
        <div className="p-3 bg-background border border-healthcare-light rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Temperature</p>
          <p className="font-semibold text-healthcare-secondary">{data[data.length - 1].temperature}°F</p>
        </div>
        <div className="p-3 bg-background border border-healthcare-light rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">O₂ Saturation</p>
          <p className="font-semibold text-healthcare-secondary">{data[data.length - 1].oxygenSat}%</p>
        </div>
        <div className="p-3 bg-background border border-healthcare-light rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <p className="font-semibold text-alert-low">Stable</p>
        </div>
      </div>
    </div>
  );
}