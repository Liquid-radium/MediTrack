import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Clock, Video, Calendar, CheckCircle, Circle } from 'lucide-react';
import { cn } from './ui/utils';

const appointments = [
  {
    id: 1,
    patientName: 'Emily Johnson',
    time: '09:00 AM',
    type: 'Consultation',
    doctor: 'Dr. Sarah Wilson',
    status: 'in-progress',
    room: '201A',
    duration: '30 min',
    avatar: 'EJ'
  },
  {
    id: 2,
    patientName: 'Michael Brown',
    time: '09:30 AM',
    type: 'Follow-up',
    doctor: 'Dr. James Kim',
    status: 'waiting',
    room: '203B',
    duration: '15 min',
    avatar: 'MB'
  },
  {
    id: 3,
    patientName: 'Sarah Davis',
    time: '10:00 AM',
    type: 'Telemedicine',
    doctor: 'Dr. Maria Lopez',
    status: 'scheduled',
    room: 'Virtual',
    duration: '20 min',
    avatar: 'SD'
  },
  {
    id: 4,
    patientName: 'David Wilson',
    time: '10:30 AM',
    type: 'Lab Review',
    doctor: 'Dr. Sarah Wilson',
    status: 'completed',
    room: '201A',
    duration: '10 min',
    avatar: 'DW'
  },
  {
    id: 5,
    patientName: 'Lisa Anderson',
    time: '11:00 AM',
    type: 'Physical Exam',
    doctor: 'Dr. Robert Chen',
    status: 'scheduled',
    room: '205C',
    duration: '45 min',
    avatar: 'LA'
  },
  {
    id: 6,
    patientName: 'John Martinez',
    time: '11:45 AM',
    type: 'Surgery Consult',
    doctor: 'Dr. James Kim',
    status: 'scheduled',
    room: '301A',
    duration: '30 min',
    avatar: 'JM'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'bg-healthcare-secondary text-white';
    case 'waiting':
      return 'bg-alert-medium text-white';
    case 'completed':
      return 'bg-alert-low text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    default:
      return Circle;
  }
};

export function LiveAppointmentsFeed() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-healthcare-primary" />
          <h3 className="font-semibold text-healthcare-primary">Live Appointments Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-alert-low rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {appointments.map((appointment) => {
          const StatusIcon = getStatusIcon(appointment.status);
          
          return (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-healthcare-accent text-white">
                    {appointment.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-healthcare-primary truncate">
                      {appointment.patientName}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getStatusColor(appointment.status))}
                    >
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                    <span>•</span>
                    <span>{appointment.type}</span>
                    <span>•</span>
                    <span>{appointment.doctor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>Room {appointment.room}</span>
                    <span>•</span>
                    <span>{appointment.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {appointment.type === 'Telemedicine' && (
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                )}
                <StatusIcon className={cn(
                  "h-4 w-4",
                  appointment.status === 'completed' ? "text-alert-low" : "text-healthcare-primary"
                )} />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button variant="outline" className="flex-1 text-healthcare-primary border-healthcare-primary hover:bg-healthcare-light">
          View Schedule
        </Button>
        <Button className="flex-1 bg-healthcare-secondary hover:bg-healthcare-primary">
          Add Appointment
        </Button>
      </div>
    </Card>
  );
}