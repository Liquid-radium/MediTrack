import { useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { usePatients } from '../../contexts/PatientContext';
import { QrCode, Download, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { QRCodeSVG } from 'qrcode.react';

export function GenerateQRView() {
  const { getPatient } = usePatients();
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    const patient = getPatient(patientId.toUpperCase());
    if (patient) {
      setSelectedPatient(patient);
      toast.success('Patient found! QR code generated.');
    } else {
      toast.error('Patient not found');
      setSelectedPatient(null);
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 512, 512);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `patient-${selectedPatient.id}-qr.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('QR code downloaded successfully!');
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const qrData = selectedPatient ? JSON.stringify({
    id: selectedPatient.id,
    name: selectedPatient.name,
    age: selectedPatient.age,
    ward: selectedPatient.ward
  }) : '';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-primary">Generate QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Create QR codes for patient identification and quick access
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-healthcare-secondary/10 rounded-lg">
              <QrCode className="h-6 w-6 text-healthcare-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-healthcare-primary">Patient ID Input</h3>
              <p className="text-sm text-muted-foreground">Enter the patient ID to generate QR code</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID</Label>
              <div className="flex gap-2">
                <Input
                  id="patient-id"
                  placeholder="Enter Patient ID (e.g., PT001)"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
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
            </div>

            {selectedPatient && (
              <div className="p-4 bg-healthcare-light/20 rounded-lg space-y-2">
                <h4 className="font-semibold text-healthcare-primary">Patient Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-semibold">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <p className="font-semibold">{selectedPatient.age}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ward:</span>
                    <p className="font-semibold">{selectedPatient.ward}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-semibold text-healthcare-secondary">{selectedPatient.id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-healthcare-light/10 rounded-lg">
            <h4 className="font-semibold text-healthcare-primary mb-2">Instructions</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Enter a valid patient ID from the system</li>
              <li>The QR code will be generated automatically</li>
              <li>Download the QR code as a PNG image</li>
              <li>Print or attach to patient records for easy scanning</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          {selectedPatient ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-healthcare-primary mb-2">Generated QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Scan this code to retrieve patient information
                </p>
              </div>

              <div 
                ref={qrRef}
                className="flex justify-center items-center p-8 bg-white rounded-lg border-2 border-healthcare-light"
              >
                <QRCodeSVG
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                  fgColor="#095256"
                  bgColor="#ffffff"
                />
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleDownload}
                  className="bg-healthcare-secondary hover:bg-healthcare-primary"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code (PNG)
                </Button>
              </div>

              <div className="p-4 bg-healthcare-light/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>File name:</strong> patient-{selectedPatient.id}-qr.png
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Format:</strong> PNG Image (512x512 pixels)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <QrCode className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                Enter a patient ID to generate a QR code
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
