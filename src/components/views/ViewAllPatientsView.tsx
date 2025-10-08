import { useState } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { usePatients } from '../../contexts/PatientContext';
import { Search, Activity, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export function ViewAllPatientsView() {
  const { patients, getPatient } = usePatients();
  const [vitalsSearchId, setVitalsSearchId] = useState('');
  const [detailsSearchId, setDetailsSearchId] = useState('');
  const [selectedPatientVitals, setSelectedPatientVitals] = useState<any>(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);

  const handleVitalsSearch = async () => {
    const patient = await getPatient(Number(vitalsSearchId));
    if (patient && patient.vitals) {
      setSelectedPatientVitals(patient);
      toast.success('Patient vitals retrieved!');
    } else {
      toast.error('Patient not found or vitals unavailable');
      setSelectedPatientVitals(null);
    }
  };

  const handleDetailsSearch = () => {
    const patient = getPatient(Number(detailsSearchId));
    if (patient) {
      setSelectedPatientDetails(patient);
      toast.success('Patient details retrieved!');
    } else {
      toast.error('Patient not found');
      setSelectedPatientDetails(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-primary">View All Patients</h1>
        <p className="text-muted-foreground mt-1">
          Browse patient records and retrieve specific patient information
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="vitals">Get Vitals</TabsTrigger>
          <TabsTrigger value="details">Get Details</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-healthcare-primary">Patient Records</h3>
              <p className="text-sm text-muted-foreground">Total Patients: {patients.length}</p>
            </div>
            
            <div className="rounded-lg border border-healthcare-light overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-healthcare-light/20">
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.patient_id}>
                      <TableCell className="font-semibold text-healthcare-secondary">
                        {patient.patient_id}
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-healthcare-accent text-healthcare-accent">
                          {patient.ward}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {patient.vitals ? (
                          <Badge className="bg-alert-low">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {patient.updated_at ? new Date(patient.updated_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-healthcare-secondary/10 rounded-lg">
                  <Activity className="h-6 w-6 text-healthcare-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-healthcare-primary">Get Patient Vitals</h3>
                  <p className="text-sm text-muted-foreground">Enter Patient ID to retrieve vital signs</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter Patient ID (e.g., PT001)"
                  value={vitalsSearchId}
                  onChange={(e) => setVitalsSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVitalsSearch()}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
                <Button 
                  onClick={handleVitalsSearch}
                  className="bg-healthcare-secondary hover:bg-healthcare-primary"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </Card>

            {selectedPatientVitals && (
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-healthcare-primary">
                      {selectedPatientVitals.name}
                    </h3>
                    {selectedPatientVitals.status && (
                      <Badge className={
                        selectedPatientVitals.status === 'critical' 
                          ? 'bg-alert-high text-white'
                          : selectedPatientVitals.status === 'stable'
                          ? 'bg-alert-low text-white'
                          : selectedPatientVitals.status === 'recovering'
                          ? 'bg-alert-medium text-white'
                          : 'bg-muted'
                      }>
                        {selectedPatientVitals.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {selectedPatientVitals.id} | Ward: {selectedPatientVitals.ward}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-healthcare-light/20 rounded-lg">
                    <span className="text-sm text-muted-foreground">Heart Rate</span>
                    <span className="font-semibold text-healthcare-primary">
                      {selectedPatientVitals.vitals.heartRate} bpm
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-healthcare-light/20 rounded-lg">
                    <span className="text-sm text-muted-foreground">Blood Pressure</span>
                    <span className="font-semibold text-healthcare-primary">
                      {selectedPatientVitals.vitals.bloodPressureSys}/{selectedPatientVitals.vitals.bloodPressureDia} mmHg
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-healthcare-light/20 rounded-lg">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-semibold text-healthcare-primary">
                      {selectedPatientVitals.vitals.temperature}°F
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-healthcare-light/20 rounded-lg">
                    <span className="text-sm text-muted-foreground">Oxygen Saturation</span>
                    <span className="font-semibold text-healthcare-primary">
                      {selectedPatientVitals.vitals.oxygenSat}%
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-healthcare-accent/10 rounded-lg">
                  <User className="h-6 w-6 text-healthcare-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-healthcare-primary">Get Patient Details</h3>
                  <p className="text-sm text-muted-foreground">Enter Patient ID to retrieve details</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter Patient ID (e.g., PT001)"
                  value={detailsSearchId}
                  onChange={(e) => setDetailsSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDetailsSearch()}
                  className="border-healthcare-light focus:border-healthcare-secondary"
                />
                <Button 
                  onClick={handleDetailsSearch}
                  className="bg-healthcare-secondary hover:bg-healthcare-primary"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </Card>

            {selectedPatientDetails && (
              <Card className="p-6">
                <h3 className="font-semibold text-healthcare-primary mb-4">Patient Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                    <p className="font-semibold text-healthcare-secondary text-lg">
                      {selectedPatientDetails.id}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-semibold text-healthcare-primary">
                      {selectedPatientDetails.name}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Age</p>
                      <p className="font-semibold text-healthcare-primary">
                        {selectedPatientDetails.age} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ward</p>
                      <p className="font-semibold text-healthcare-primary">
                        {selectedPatientDetails.ward}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                    <p className="font-semibold text-healthcare-primary">
                      {new Date(selectedPatientDetails.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                    <p className="font-semibold text-healthcare-primary">
                      {new Date(selectedPatientDetails.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
