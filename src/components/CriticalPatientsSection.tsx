import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { usePatients } from "../contexts/PatientContext";
import {
  AlertCircle,
  Activity,
  Thermometer,
  Heart,
  Droplet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function CriticalPatientsSection() {
  const { patients, updatePatient } = usePatients();

  const criticalPatients = patients.filter(
    (p) => p.status === "critical",
  );

  const handleStatusChange = (
    patientId: string,
    newStatus: "critical" | "stable" | "recovering",
  ) => {
    updatePatient(Number(patientId), { status: newStatus });
    toast.success(`Patient status updated to ${newStatus}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "critical":
        return "bg-alert-high text-white";
      case "stable":
        return "bg-alert-low text-white";
      case "recovering":
        return "bg-alert-medium text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getVitalStatus = (
    value: number | undefined,
    normal: { min: number; max: number },
  ) => {
    if (typeof value !== "number") {
      return "text-muted-foreground";
    }
    if (value < normal.min || value > normal.max) {
      return "text-alert-high";
    }
    return "text-alert-low";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-alert-high/10 rounded-lg">
            <AlertCircle className="h-6 w-6 text-alert-high" />
          </div>
          <div>
            <h3 className="font-semibold text-healthcare-primary">
              Critical Patients Management
            </h3>
            <p className="text-sm text-muted-foreground">
              {criticalPatients.length} patient
              {criticalPatients.length !== 1 ? "s" : ""} in
              critical condition
            </p>
          </div>
        </div>
      </div>

      {criticalPatients.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No patients in critical condition</p>
        </div>
      ) : (
        <div className="space-y-4">
          {criticalPatients.map((patient) => (
            <Card
              key={patient.patient_id}
              className="p-4 border-l-4 border-l-alert-high bg-alert-high/5"
            >
              <div className="space-y-4">
                {/* Patient Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-healthcare-primary">
                        {patient.name}
                      </h4>
                      <Badge
                        className={getStatusColor(
                          patient.status,
                        )}
                      >
                        {patient.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {patient.age} years • {patient.ward} • ID:{" "}
                      {patient.patient_id}
                    </p>
                  </div>
                </div>

                {/* Vitals Display */}
                {patient.vitals && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="flex items-center gap-2">
                      <Heart
                        className={`h-4 w-4 ${getVitalStatus(patient.vitals.heartRate, { min: 60, max: 100 })}`}
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Heart Rate
                        </p>
                        <p
                          className={`font-semibold ${getVitalStatus(patient.vitals.heartRate, { min: 60, max: 100 })}`}
                        >
                          {patient.vitals.heartRate} bpm
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity
                        className={`h-4 w-4 ${getVitalStatus(patient.vitals.bloodPressureSys, { min: 90, max: 140 })}`}
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Blood Pressure
                        </p>
                        <p
                          className={`font-semibold ${getVitalStatus(patient.vitals.bloodPressureSys, { min: 90, max: 140 })}`}
                        >
                          {patient.vitals.bloodPressureSys}/
                          {patient.vitals.bloodPressureDia}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Thermometer
                        className={`h-4 w-4 ${getVitalStatus(patient.vitals.temperature, { min: 97, max: 99 })}`}
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Temperature
                        </p>
                        <p
                          className={`font-semibold ${getVitalStatus(patient.vitals.temperature, { min: 97, max: 99 })}`}
                        >
                          {patient.vitals.temperature}°F
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplet
                        className={`h-4 w-4 ${getVitalStatus(patient.vitals.oxygenSat, { min: 95, max: 100 })}`}
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Oxygen
                        </p>
                        <p
                          className={`font-semibold ${getVitalStatus(patient.vitals.oxygenSat, { min: 95, max: 100 })}`}
                        >
                          {patient.vitals.oxygenSat}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Update Status
                        </Label>
                        <Select
                          value={patient.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              String(patient.patient_id),
                              value as
                                | "critical"
                                | "stable"
                                | "recovering",
                            )
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">
                              Critical
                            </SelectItem>
                            <SelectItem value="stable">
                              Stable
                            </SelectItem>
                            <SelectItem value="recovering">
                              Recovering
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <span>
                    Last updated:{" "}
                    {patient.updated_at
                      ? patient.updated_at.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* All Patients Status Overview */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-healthcare-primary mb-4">
          All Patients Status Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-alert-high/5 border-alert-high/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Critical
                </p>
                <p className="text-2xl font-bold text-alert-high">
                  {
                    patients.filter(
                      (p) => p.status === "critical",
                    ).length
                  }
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-alert-high" />
            </div>
          </Card>

          <Card className="p-4 bg-alert-low/5 border-alert-low/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Stable
                </p>
                <p className="text-2xl font-bold text-alert-low">
                  {
                    patients.filter(
                      (p) => p.status === "stable",
                    ).length
                  }
                </p>
              </div>
              <Activity className="h-8 w-8 text-alert-low" />
            </div>
          </Card>

          <Card className="p-4 bg-alert-medium/5 border-alert-medium/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Recovering
                </p>
                <p className="text-2xl font-bold text-alert-medium">
                  {
                    patients.filter(
                      (p) => p.status === "recovering",
                    ).length
                  }
                </p>
              </div>
              <Heart className="h-8 w-8 text-alert-medium" />
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}