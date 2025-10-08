import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Bell, Shield, Database } from 'lucide-react';
import { Separator } from './ui/separator';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    criticalAlerts: true,
    
    // Privacy Settings
    allowDataSharing: false,
    twoFactorAuth: true,
    
    // Data Settings
    autoSave: true,
    dataRetention: '90days',
  });

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSelect = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
    onOpenChange(false);
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: true,
      smsAlerts: false,
      criticalAlerts: true,
      allowDataSharing: false,
      twoFactorAuth: true,
      autoSave: true,
      dataRetention: '90days',
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-healthcare-primary">Settings</DialogTitle>
          <DialogDescription>
            Manage your application preferences and settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-healthcare-secondary" />
              <div>
                <h3 className="font-semibold text-healthcare-primary">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get browser notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                </div>
                <Switch
                  checked={settings.smsAlerts}
                  onCheckedChange={(checked) => handleToggle('smsAlerts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Critical Alerts</Label>
                  <p className="text-sm text-muted-foreground">Always notify for urgent matters</p>
                </div>
                <Switch
                  checked={settings.criticalAlerts}
                  onCheckedChange={(checked) => handleToggle('criticalAlerts', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-healthcare-secondary" />
              <div>
                <h3 className="font-semibold text-healthcare-primary">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share anonymized usage data</p>
                </div>
                <Switch
                  checked={settings.allowDataSharing}
                  onCheckedChange={(checked) => handleToggle('allowDataSharing', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Extra security for your account</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleToggle('twoFactorAuth', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-healthcare-secondary" />
              <div>
                <h3 className="font-semibold text-healthcare-primary">Data Management</h3>
                <p className="text-sm text-muted-foreground">Control data storage and retention</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleToggle('autoSave', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select value={settings.dataRetention} onValueChange={(value) => handleSelect('dataRetention', value)}>
                  <SelectTrigger className="border-healthcare-light">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long to keep patient records and logs
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-healthcare-light text-healthcare-primary"
          >
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-healthcare-light"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-healthcare-secondary hover:bg-healthcare-primary"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
