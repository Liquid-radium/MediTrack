import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useUser } from '../contexts/UserContext';
import { User, Phone, Mail, Briefcase, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
    department: user.department
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      department: user.department
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      department: user.department
    });
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-healthcare-primary">User Profile</DialogTitle>
          <DialogDescription>
            View and manage your profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-healthcare-secondary text-white text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-healthcare-primary">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-healthcare-secondary" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              ) : (
                <p className="px-3 py-2 bg-healthcare-light/20 rounded-md">{user.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-healthcare-secondary" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="profile-phone"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              ) : (
                <p className="px-3 py-2 bg-healthcare-light/20 rounded-md">{user.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-healthcare-secondary" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              ) : (
                <p className="px-3 py-2 bg-healthcare-light/20 rounded-md">{user.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-role" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-healthcare-secondary" />
                Role
              </Label>
              {isEditing ? (
                <Input
                  id="profile-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              ) : (
                <p className="px-3 py-2 bg-healthcare-light/20 rounded-md">{user.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-department" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-healthcare-secondary" />
                Department
              </Label>
              {isEditing ? (
                <Input
                  id="profile-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              ) : (
                <p className="px-3 py-2 bg-healthcare-light/20 rounded-md">{user.department}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-healthcare-light"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-healthcare-secondary hover:bg-healthcare-primary"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEdit}
                className="bg-healthcare-secondary hover:bg-healthcare-primary"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
