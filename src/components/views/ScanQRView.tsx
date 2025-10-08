import { useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScanLine, Upload, Camera, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Html5Qrcode } from 'html5-qrcode';

export function ScanQRView() {
  const [scannedData, setScannedData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
          stopCamera();
        },
        (errorMessage) => {
          // Ignore errors during scanning
        }
      );

      setIsScanning(true);
      setScannerReady(true);
      toast.success('Camera started. Point at a QR code to scan.');
    } catch (err) {
      console.error('Error starting camera:', err);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
        setScannerReady(false);
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      if (data.id && data.name) {
        setScannedData(data);
        toast.success('QR code scanned successfully!');
      } else {
        toast.error('Invalid patient QR code');
      }
    } catch (err) {
      toast.error('Failed to parse QR code data');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode("qr-file-reader");
      const result = await scanner.scanFile(file, true);
      handleScanSuccess(result);
      scanner.clear();
      toast.success('QR code uploaded and scanned successfully!');
    } catch (err) {
      console.error('Error scanning file:', err);
      toast.error('Failed to scan QR code from image');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setScannedData(null);
    if (isScanning) {
      stopCamera();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-primary">Scan QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Scan patient QR codes using camera or upload an image
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-healthcare-secondary/10 rounded-lg">
              <ScanLine className="h-6 w-6 text-healthcare-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-healthcare-primary">QR Code Scanner</h3>
              <p className="text-sm text-muted-foreground">Use camera or upload QR code image</p>
            </div>
          </div>

          <div className="space-y-4">
            {!isScanning && (
              <>
                <Button 
                  onClick={startCamera}
                  className="w-full bg-healthcare-secondary hover:bg-healthcare-primary"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Camera Scanner
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-healthcare-light" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="qr-upload"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-healthcare-light text-healthcare-primary hover:bg-healthcare-light/20"
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload QR Code Image
                </Button>
              </>
            )}

            {isScanning && (
              <div className="space-y-4">
                <div 
                  id="qr-reader" 
                  className="rounded-lg overflow-hidden border-2 border-healthcare-secondary"
                />
                <Button 
                  onClick={stopCamera}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Stop Scanner
                </Button>
              </div>
            )}

            <div id="qr-file-reader" className="hidden" />

            <div className="p-4 bg-healthcare-light/10 rounded-lg">
              <h4 className="font-semibold text-healthcare-primary mb-2">Instructions</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Click "Start Camera Scanner" to use your device camera</li>
                <li>Point the camera at a patient QR code</li>
                <li>Or upload a QR code image from your device</li>
                <li>Patient details will be displayed after successful scan</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          {scannedData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-healthcare-primary">Scanned Patient Details</h3>
                  <p className="text-sm text-muted-foreground">QR code successfully decoded</p>
                </div>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="border-healthcare-light"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              <div className="p-6 bg-alert-low/5 border-2 border-alert-low rounded-lg space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                  <p className="text-2xl font-bold text-healthcare-secondary">
                    {scannedData.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-semibold text-healthcare-primary">
                      {scannedData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Age</p>
                    <p className="font-semibold text-healthcare-primary">
                      {scannedData.age} years
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ward/Department</p>
                  <p className="font-semibold text-healthcare-primary">
                    {scannedData.ward}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-healthcare-light/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ✓ Patient verified and ready for processing
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ScanLine className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">No QR code scanned yet</p>
              <p className="text-sm text-muted-foreground">
                Start the scanner or upload an image to begin
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
