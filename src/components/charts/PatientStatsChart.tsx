import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePatients } from '../../contexts/PatientContext';

export function PatientStatsChart() {
  const { patients } = usePatients();
  
  // Generate data for the last 7 days
  const generateWeekData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      // Count patients added on this day (inpatient = admitted)
      const inpatient = patients.filter(p => {
      if (typeof p.created_at !== 'string') return false;
      const createdDate = new Date(p.created_at);
      return createdDate.toDateString() === date.toDateString();
    }).length;

      
      // Count patients discharged on this day (outpatient)
      const outpatient = patients.filter(p => {
        if (!p.discharged_at) return false;
        const dischargedDate = new Date(p.discharged_at);
        return dischargedDate.toDateString() === date.toDateString();
      }).length;
      
      // Count critical patients admitted on this day (emergency)
      const emergency = patients.filter(p => {
        if (typeof p.created_at !== 'string') return false;
      const createdDate = new Date(p.created_at);
      return createdDate.toDateString() === date.toDateString();
    }).length;
      
      weekData.push({
        name: dayName,
        inpatient,
        outpatient,
        emergency
      });
    }
    
    return weekData;
  };
  
  const data = generateWeekData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#B6E3E9" />
          <XAxis 
            dataKey="name" 
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
                inpatient: 'Admitted Patients',
                outpatient: 'Discharged Patients',
                emergency: 'Critical Admissions'
              };
              return [value, labels[name] || name];
            }}
          />
          <Bar dataKey="inpatient" fill="#095256" radius={[2, 2, 0, 0]} />
          <Bar dataKey="outpatient" fill="#087F8C" radius={[2, 2, 0, 0]} />
          <Bar dataKey="emergency" fill="#3F4785" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#095256] rounded"></div>
          <span className="text-sm text-muted-foreground">Admitted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#087F8C] rounded"></div>
          <span className="text-sm text-muted-foreground">Discharged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3F4785] rounded"></div>
          <span className="text-sm text-muted-foreground">Critical Admissions</span>
        </div>
      </div>
    </div>
  );
}
