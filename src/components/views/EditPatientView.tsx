import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { usePatients } from '../../contexts/PatientContext';
import { UserCog, Search, Save } from 'lucide-react';
import { toast } from 'sonner';

export function EditPatientView() {
  const { getPatient, updatePatient } = usePatients();
  const [searchId, setSearchId] = useState('');
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    ward: ''
  });

  const handleSearch = async () => {
    const patient = await getPatient(Number(searchId));
    if (patient) {
      setCurrentPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        ward: patient.ward
      });
      toast.success('Patient found!');
    } else {
      toast.error('Patient not found');
      setCurrentPatient(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPatient) {
      toast.error('Please search for a patient first');
      return;
    }

    if (!formData.name || !formData.age || !formData.ward) {
      toast.error('Please fill in all fields');
      return;
    }

    await updatePatient(currentPatient.id, {
      name: formData.name,
      age: parseInt(formData.age),
      ward: formData.ward
    });

    toast.success('Patient details updated successfully!');
    
    // Refresh the current patient data
    const updatedPatient = await getPatient(currentPatient.id);
    if (updatedPatient) {
      setCurrentPatient(updatedPatient);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-primary">Edit Patient Details</h1>
        <p className="text-muted-foreground mt-1">
          Search and update existing patient records
        </p>
      </div>

      <Card className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-healthcare-secondary/10 rounded-lg">
            <Search className="h-6 w-6 text-healthcare-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-healthcare-primary">Search Patient</h3>
            <p className="text-sm text-muted-foreground">Enter Patient ID to load details</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter Patient ID (e.g., PT001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border-healthcare-light focus:border-healthcare-secondary"
          />
          <Button 
            onClick={handleSearch}
            className="bg-healthcare-secondary hover:bg-healthcare-primary"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {currentPatient && (
          <div className="space-y-6 pt-6 border-t border-healthcare-light">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-healthcare-accent/10 rounded-lg">
                <UserCog className="h-6 w-6 text-healthcare-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-healthcare-primary">Edit Patient Information</h3>
                <p className="text-sm text-muted-foreground">
                  Patient ID: <span className="font-semibold text-healthcare-secondary">{currentPatient.id}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter patient's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-age">Age *</Label>
                <Input
                  id="edit-age"
                  type="number"
                  placeholder="Enter patient's age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="0"
                  max="150"
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-ward">Ward/Department *</Label>
                <Input
                  id="edit-ward"
                  placeholder="e.g., Cardiology, ICU, General"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
              </div>

              <div className="p-4 bg-healthcare-light/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Last Updated:</strong> {new Date(currentPatient.updatedAt).toLocaleString()}
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-healthcare-secondary hover:bg-healthcare-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Patient Details
              </Button>
            </form>
          </div>
        )}

        {!currentPatient && (
          <div className="text-center py-8 text-muted-foreground">
            <UserCog className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Search for a patient to edit their details</p>
          </div>
        )}
      </Card>
    </div>
  );
}
