import { type Criminal } from "@/lib/criminal-data";
import { MapPin, AlertTriangle, Eye, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface CriminalCardProps {
  criminal: Criminal;
  compact?: boolean;
}

export default function CriminalCard({ criminal, compact }: CriminalCardProps) {
  const threatClass = criminal.threat_level === "High" ? "threat-high" : criminal.threat_level === "Medium" ? "threat-medium" : "threat-low";
  const borderClass = criminal.threat_level === "High" ? "border-accent/40 danger-glow" : "border-border";

  return (
    <div className={cn("detective-card p-4 border rounded-lg transition-all hover:border-primary/40", borderClass)}>
      <div className="flex gap-4">
        {/* Photo */}
        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0 relative">
          {criminal.photo_url ? (
            <img src={criminal.photo_url} alt={criminal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-mono text-xs">
              NO PHOTO
            </div>
          )}
          {criminal.threat_level === "High" && (
            <div className="absolute top-0 right-0 w-5 h-5 bg-accent rounded-bl-lg flex items-center justify-center">
              <AlertTriangle className="w-3 h-3 text-accent-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-foreground truncate">{criminal.name}</h3>
            <span className={cn("text-xs font-mono font-bold", threatClass)}>
              {criminal.threat_level.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{criminal.criminal_id} • {criminal.gender} • Age {criminal.age}</p>

          {!compact && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                <Eye className="w-3 h-3 text-primary" /> {criminal.eye_color} eyes • {criminal.hair_color} hair
              </div>
              {criminal.scar_location && criminal.scar_location !== "None" && (
                <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                  <Scissors className="w-3 h-3 text-warning" /> Scar: {criminal.scar_location}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
                <MapPin className="w-3 h-3 text-accent" /> {criminal.last_known_location}
              </div>
              <div className="mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                  {criminal.crime_type}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!compact && criminal.distinctive_features && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            <span className="text-evidence">FEATURES:</span> {criminal.distinctive_features}
          </p>
        </div>
      )}
    </div>
  );
}
