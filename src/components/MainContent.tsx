import { Card } from './ui/card';
import { PatientStatsChart } from './charts/PatientStatsChart';
import { PatientVitalsChart } from './charts/PatientVitalsChart';
import { QuickMetrics } from './QuickMetrics';
import { CriticalPatientsSection } from './CriticalPatientsSection';

export function MainContent() {
  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-healthcare-primary">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, Dr. Johnson. Here's what's happening today.
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
            <div className="font-semibold text-healthcare-primary">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <QuickMetrics />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-healthcare-primary mb-4">Patient Statistics</h3>
            <PatientStatsChart />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-healthcare-primary mb-4">Patient Vitals Monitor</h3>
            <PatientVitalsChart />
          </Card>
        </div>

        {/* Critical Patients Management */}
        <CriticalPatientsSection />
      </div>
    </main>
  );
}