import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, UserPlus, Database, Search, Terminal, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";

const menuItems = [
  { label: "Add Criminal", icon: UserPlus, path: "/add-criminal", description: "Register new suspect in the database" },
  { label: "Criminal Database", icon: Database, path: "/database", description: "View and search all criminal records" },
  { label: "Investigation Mode", icon: Search, path: "/investigate", description: "Match clues to identify suspects" },
  { label: "SQL Query Console", icon: Terminal, path: "/console", description: "Execute raw database queries" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="hsl(200,100%,45%)" />

      {/* Scan line effect */}
      <div className="scan-line absolute inset-0 pointer-events-none z-0 h-[200%]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 glow-border flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-wider text-center mb-2"
        >
          CRIMINAL INVESTIGATION
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-primary font-mono text-sm tracking-[0.3em] mb-12"
        >
          DATABASE SYSTEM v2.0
        </motion.p>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <button
                onClick={() => navigate(item.path)}
                className="detective-card glow-border w-full p-6 text-left group hover:border-primary/60 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">
                      {item.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex items-center gap-6 text-xs font-mono text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            SYSTEM ONLINE
          </span>
          <span>CLEARANCE: LEVEL 5</span>
          <span>CASES: ACTIVE</span>
        </motion.div>
      </div>
    </div>
  );
}
