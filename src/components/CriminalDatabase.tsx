import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCriminals, type Criminal } from "@/lib/criminal-data";
import CriminalCard from "@/components/CriminalCard";

export default function CriminalDatabase() {
  const navigate = useNavigate();

  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [search, setSearch] = useState("");
  const [filterEye, setFilterEye] = useState("all");
  const [filterCrime, setFilterCrime] = useState("all");
  const [filterThreat, setFilterThreat] = useState("all");

  // LOAD DATA FROM DATABASE API
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCriminals();
        setCriminals(data);
      } catch (err) {
        console.error("Failed to load criminals:", err);
      }
    }


    loadData();


  }, []);

  // FILTERING LOGIC
  const filtered = useMemo(() => {
    return criminals.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.distinctive_features.toLowerCase().includes(search.toLowerCase())
      )
        return false;


      if (filterEye !== "all" && c.eye_color.toLowerCase() !== filterEye)
        return false;

      if (filterCrime !== "all" && c.crime_type.toLowerCase() !== filterCrime)
        return false;

      if (filterThreat !== "all" && c.threat_level !== filterThreat)
        return false;

      return true;
    });


  }, [criminals, search, filterEye, filterCrime, filterThreat]);

  const uniqueEyes = [...new Set(criminals.map((c) => c.eye_color))];
  const uniqueCrimes = [...new Set(criminals.map((c) => c.crime_type))];

  // EXPORT CSV
  const exportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Gender",
      "Age",
      "Eye Color",
      "Crime Type",
      "Threat Level",
      "Location",
    ];


    const rows = filtered.map((c) =>
      [
        c.criminal_id,
        c.name,
        c.gender,
        c.age,
        c.eye_color,
        c.crime_type,
        c.threat_level,
        c.last_known_location,
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "criminal_records.csv";
    a.click();


  };

  return (<div className="min-h-screen bg-background p-6"> <div className="max-w-6xl mx-auto">


    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to HQ
      </Button>

      <Button
        variant="outline"
        onClick={exportCSV}
        className="text-xs font-mono"
      >
        <Download className="w-4 h-4 mr-2" /> EXPORT CSV
      </Button>
    </div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-2xl font-bold text-foreground tracking-wide mb-1">
        CRIMINAL DATABASE
      </h1>

      <p className="text-xs text-muted-foreground font-mono mb-6">
        {filtered.length} RECORDS FOUND
      </p>

      {/* FILTERS */}
      <div className="detective-card p-4 mb-6 flex flex-wrap gap-3 items-end">

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or features..."
              className="pl-10 bg-muted border-border"
            />
          </div>
        </div>

        <Select value={filterEye} onValueChange={setFilterEye}>
          <SelectTrigger className="w-[140px] bg-muted border-border text-xs">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Eye Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Eyes</SelectItem>
            {uniqueEyes.map((e) => (
              <SelectItem key={e} value={e.toLowerCase()}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCrime} onValueChange={setFilterCrime}>
          <SelectTrigger className="w-[140px] bg-muted border-border text-xs">
            <SelectValue placeholder="Crime Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crimes</SelectItem>
            {uniqueCrimes.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterThreat} onValueChange={setFilterThreat}>
          <SelectTrigger className="w-[140px] bg-muted border-border text-xs">
            <SelectValue placeholder="Threat Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="High">🔴 High</SelectItem>
            <SelectItem value="Medium">🟡 Medium</SelectItem>
            <SelectItem value="Low">🟢 Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CRIMINAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((criminal, i) => (
          <motion.div
            key={criminal.criminal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <CriminalCard criminal={criminal} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground font-mono">
          NO MATCHING RECORDS FOUND
        </div>
      )}
    </motion.div>
  </div>
  </div>


  );
}
