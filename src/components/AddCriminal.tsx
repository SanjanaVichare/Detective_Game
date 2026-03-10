import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCriminal } from "@/lib/criminal-data";
import { toast } from "sonner";

export default function AddCriminal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    age: 30,
    eye_color: "",
    hair_color: "",
    height: "",
    scar_location: "",
    distinctive_features: "",
    last_known_location: "",
    crime_type: "",
    threat_level: "Medium" as "High" | "Medium" | "Low",
  });

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.crime_type) {
      toast.error("Name and Crime Type are required.");
      return;
    }
    addCriminal(form);
    toast.success(`Criminal "${form.name}" added to database.`);
    navigate("/database");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to HQ
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="detective-card glow-border p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground tracking-wide">ADD CRIMINAL</h1>
              <p className="text-xs text-muted-foreground font-mono">REGISTER NEW SUSPECT</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-xs font-mono text-muted-foreground">FULL NAME *</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter suspect name" className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">GENDER</Label>
              <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                <SelectTrigger className="bg-muted border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">AGE</Label>
              <Input type="number" value={form.age} onChange={(e) => update("age", +e.target.value)} className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">EYE COLOR</Label>
              <Input value={form.eye_color} onChange={(e) => update("eye_color", e.target.value)} placeholder="e.g. Brown, Blue" className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">HAIR COLOR</Label>
              <Input value={form.hair_color} onChange={(e) => update("hair_color", e.target.value)} placeholder="e.g. Black, Blonde" className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">HEIGHT</Label>
              <Input value={form.height} onChange={(e) => update("height", e.target.value)} placeholder="e.g. 5ft 10in" className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">SCAR LOCATION</Label>
              <Input value={form.scar_location} onChange={(e) => update("scar_location", e.target.value)} placeholder="e.g. Left cheek" className="bg-muted border-border mt-1" />
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs font-mono text-muted-foreground">DISTINCTIVE FEATURES</Label>
              <Input value={form.distinctive_features} onChange={(e) => update("distinctive_features", e.target.value)} placeholder="Tattoos, marks, habits..." className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">LAST KNOWN LOCATION</Label>
              <Input value={form.last_known_location} onChange={(e) => update("last_known_location", e.target.value)} placeholder="Location" className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">CRIME TYPE *</Label>
              <Input value={form.crime_type} onChange={(e) => update("crime_type", e.target.value)} placeholder="e.g. Robbery, Fraud" className="bg-muted border-border mt-1" />
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">THREAT LEVEL</Label>
              <Select value={form.threat_level} onValueChange={(v) => update("threat_level", v)}>
                <SelectTrigger className="bg-muted border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">🔴 High</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 pt-4">
              <Button type="submit" className="w-full font-display tracking-wider">
                <Save className="w-4 h-4 mr-2" /> REGISTER SUSPECT
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
