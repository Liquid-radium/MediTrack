import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { usePatients } from '../../contexts/PatientContext';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AddPatientView() {
  const { addPatient } = usePatients();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    ward: ''
  });
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.ward) {
      toast.error('Please fill in all fields');
      return;
    }

    const newId = addPatient({
      name: formData.name,
      age: parseInt(formData.age),
      ward: formData.ward,
      status: 'stable',
      vitals: {
        heartRate: 75,
        bloodPressureSys: 120,
        bloodPressureDia: 80,
        temperature: 98.6,
        oxygenSat: 98
      }
    });

    setGeneratedId(newId);
    setFormData({ name: '', age: '', ward: '' });
    toast.success(`Patient added successfully! ID: ${newId}`);
  };

  const handleReset = () => {
    setFormData({ name: '', age: '', ward: '' });
    setGeneratedId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-primary">Add New Patient</h1>
        <p className="text-muted-foreground mt-1">
          Register a new patient in the system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-healthcare-secondary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-healthcare-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-healthcare-primary">Patient Registration Form</h3>
              <p className="text-sm text-muted-foreground">Fill in the patient details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter patient's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-healthcare-light focus:border-healthcare-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
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
              <Label htmlFor="ward">Ward/Department *</Label>
              <Input
                id="ward"
                placeholder="e.g., Cardiology, ICU, General"
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="border-healthcare-light focus:border-healthcare-secondary"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-healthcare-secondary hover:bg-healthcare-primary"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-healthcare-light text-healthcare-primary hover:bg-healthcare-light/20"
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          {generatedId && (
            <Card className="p-6 bg-alert-low/5 border-alert-low">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-alert-low mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-healthcare-primary mb-2">
                    Patient Successfully Registered!
                  </h3>
                  <div className="space-y-2">
                    <div className="p-4 bg-white rounded-lg border border-alert-low">
                      <p className="text-sm text-muted-foreground mb-1">Generated Patient ID</p>
                      <p className="text-2xl font-bold text-healthcare-secondary">{generatedId}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please note this ID for future reference. You can now generate a QR code for this patient.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-semibold text-healthcare-primary mb-4">Instructions</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-healthcare-secondary text-white">1</span>
                <p>Fill in all required fields marked with an asterisk (*)</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-healthcare-secondary text-white">2</span>
                <p>A unique Patient ID will be automatically generated upon submission</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-healthcare-secondary text-white">3</span>
                <p>Default vital signs will be initialized for the new patient</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-healthcare-secondary text-white">4</span>
                <p>Use the generated ID to access patient records and generate QR codes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
