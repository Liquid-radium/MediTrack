import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from './ui/utils';
import { usePatients } from '../contexts/PatientContext';

const getSeverityColor = (status?: string) => {
  switch (status) {
    case 'critical':
      return 'bg-alert-high text-white';
    case 'recovering':
      return 'bg-alert-medium text-white';
    case 'stable':
      return 'bg-alert-low text-white';
    default:
      return 'bg-muted text-foreground';
  }
};

export function HighAlertPatients() {
  const { patients } = usePatients();
  
  // Get critical patients
  const criticalPatients = patients.filter(p => p.status === 'critical');

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-alert-high" />
        <h3 className="font-semibold text-healthcare-primary">High Alert Patients</h3>
        <Badge variant="secondary" className="ml-auto bg-alert-high/10 text-alert-high">
          {criticalPatients.length}
        </Badge>
      </div>

      <div className="space-y-4">
        {criticalPatients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No critical patients at this time</p>
          </div>
        ) : (
          criticalPatients.map((patient, index) => (
            <div
              key={patient.id}
              className={cn(
                "border rounded-lg p-4 transition-colors hover:bg-muted/30",
                index === 0 ? "border-alert-high" : "border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-healthcare-secondary text-white">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-healthcare-primary truncate">
                      {patient.name}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {patient.age}y
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getSeverityColor(patient.status))}
                    >
                      {patient.status?.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {patient.ward} • ID: {patient.id}
                  </p>
                  
                  {patient.vitals && (
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div className="bg-muted rounded p-1 text-center">
                        <div className="font-semibold text-healthcare-primary">HR</div>
                        <div className={cn(
                          patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60
                            ? "text-alert-high" 
                            : "text-alert-low"
                        )}>
                          {patient.vitals.heartRate}
                        </div>
                      </div>
                      <div className="bg-muted rounded p-1 text-center">
                        <div className="font-semibold text-healthcare-primary">BP</div>
                        <div className={cn(
                          patient.vitals.bloodPressureSys > 140 || patient.vitals.bloodPressureSys < 90
                            ? "text-alert-high"
                            : "text-muted-foreground"
                        )}>
                          {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
                        </div>
                      </div>
                      <div className="bg-muted rounded p-1 text-center">
                        <div className="font-semibold text-healthcare-primary">O2</div>
                        <div className={cn(
                          patient.vitals.oxygenSat < 95
                            ? "text-alert-high" 
                            : "text-alert-low"
                        )}>
                          {patient.vitals.oxygenSat}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Updated {patient.updatedAt.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
