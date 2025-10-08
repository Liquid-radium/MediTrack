import { 
  UserPlus, 
  UserCog, 
  Users, 
  QrCode, 
  ScanLine, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  patientCount?: number;
}

export function Sidebar({ isOpen, activeTab, onTabChange, patientCount = 0 }: SidebarProps) {
  const sidebarItems = [
    {
      title: 'Add Patients',
      icon: UserPlus,
    },
    {
      title: 'Edit Patients',
      icon: UserCog,
    },
    {
      title: 'View All Patients',
      icon: Users,
      count: patientCount
    },
    {
      title: 'Generate QR',
      icon: QrCode
    },
    {
      title: 'Scan QR',
      icon: ScanLine
    },
    {
      title: 'High Alert Patients',
      icon: AlertTriangle,
      count: 5,
      urgent: true
    }
  ];
  if (!isOpen) {
    return (
      <div className="w-16 bg-healthcare-primary border-r border-sidebar-border flex flex-col py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.title}
              variant="ghost"
              size="sm"
              className="mx-2 mb-2 h-12 w-12 p-0 text-white hover:bg-healthcare-secondary relative"
              onClick={() => onTabChange(item.title)}
            >
              <Icon className="h-5 w-5" />
              {item.count && (
                <span className={cn(
                  "absolute -top-1 -right-1 min-w-5 h-5 rounded-full text-xs flex items-center justify-center px-1",
                  item.urgent ? "bg-alert-high" : "bg-healthcare-accent",
                  "text-white"
                )}>
                  {item.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 bg-healthcare-primary border-r border-sidebar-border flex flex-col">
      <div className="p-4">
        <h2 className="text-white font-semibold mb-4">Navigation</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.title;
            
            return (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-11 px-3 relative",
                  isActive 
                    ? "bg-healthcare-secondary text-white" 
                    : "text-white/80 hover:bg-healthcare-secondary/50 hover:text-white"
                )}
                onClick={() => onTabChange(item.title)}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="flex-1">{item.title}</span>
                {item.count && (
                  <span className={cn(
                    "min-w-6 h-6 rounded-full text-xs flex items-center justify-center px-2 ml-2",
                    item.urgent ? "bg-alert-high" : "bg-healthcare-accent",
                    "text-white"
                  )}>
                    {item.count}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}