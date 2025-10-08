import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { time: '8:00', scheduled: 12, completed: 10, cancelled: 1 },
  { time: '9:00', scheduled: 18, completed: 15, cancelled: 2 },
  { time: '10:00', scheduled: 22, completed: 20, cancelled: 1 },
  { time: '11:00', scheduled: 25, completed: 22, cancelled: 2 },
  { time: '12:00', scheduled: 15, completed: 13, cancelled: 1 },
  { time: '13:00', scheduled: 20, completed: 18, cancelled: 1 },
  { time: '14:00', scheduled: 28, completed: 25, cancelled: 2 },
  { time: '15:00', scheduled: 24, completed: 21, cancelled: 2 },
  { time: '16:00', scheduled: 19, completed: 17, cancelled: 1 },
  { time: '17:00', scheduled: 16, completed: 14, cancelled: 1 }
];

export function AppointmentChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#087F8C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#087F8C" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#98C1B4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#98C1B4" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          />
          <Area
            type="monotone"
            dataKey="scheduled"
            stroke="#087F8C"
            fillOpacity={1}
            fill="url(#scheduledGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#98C1B4"
            fillOpacity={1}
            fill="url(#completedGradient)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="cancelled"
            stroke="#d4183d"
            strokeWidth={2}
            dot={{ fill: '#d4183d', strokeWidth: 2, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#087F8C] rounded"></div>
          <span className="text-sm text-muted-foreground">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#98C1B4] rounded"></div>
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#d4183d] rounded"></div>
          <span className="text-sm text-muted-foreground">Cancelled</span>
        </div>
      </div>
    </div>
  );
}