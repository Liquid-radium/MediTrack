import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { cn } from './ui/utils';
import { usePatients } from '../contexts/PatientContext';

export function QuickMetrics() {
  const { patients } = usePatients();
  
  // Calculate metrics
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.status === 'critical').length;
  
  // Active patients are those not discharged
  const activePatients = patients.filter(p => !p.dischargedAt).length;
  
  const metrics = [
    {
      title: 'Total Patients',
      value: totalPatients.toString(),
      change: '+' + Math.floor(totalPatients * 0.12),
      trend: 'up',
      icon: Users,
      color: 'healthcare-secondary'
    },
    {
      title: 'Active Patients',
      value: activePatients.toString(),
      change: '+' + Math.floor(activePatients * 0.05),
      trend: 'up',
      icon: Users,
      color: 'healthcare-accent'
    },
    {
      title: 'Critical Alerts',
      value: criticalPatients.toString(),
      change: criticalPatients > 0 ? '+' + criticalPatients : '0',
      trend: criticalPatients > 0 ? 'up' : 'down',
      icon: AlertTriangle,
      color: 'alert-high'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.trend === 'up';
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={metric.title} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-lg",
                `bg-${metric.color}/10`
              )}>
                <Icon className={cn("h-6 w-6", `text-${metric.color}`)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm px-2 py-1 rounded-full",
                isPositive && metric.color !== 'alert-high' 
                  ? "text-alert-low bg-alert-low/10" 
                  : metric.color === 'alert-high'
                  ? "text-alert-high bg-alert-high/10"
                  : "text-alert-low bg-alert-low/10"
              )}>
                <TrendIcon className="h-3 w-3" />
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-healthcare-primary mb-1">
                {metric.value}
              </h3>
              <p className="text-muted-foreground text-sm">{metric.title}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
