import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Terminal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SQLConsole() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("SELECT * FROM criminals WHERE threat_level='High';");
  const [result, setResult] = useState<{ columns: string[]; rows: any[][]; error?: string } | null>(null);

  const runQuery = async () => {
    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({
        columns: [],
        rows: [],
        error: "Failed to execute query",
      });
    }
  };

  const sampleQueries = [
    "SELECT * FROM criminals;",
    "SELECT * FROM criminals WHERE eye_color='Brown';",
    "SELECT name, crime_type, threat_level FROM criminals WHERE threat_level='High';",
    "SELECT * FROM criminals WHERE scar_location LIKE '%cheek%';",
    "SELECT * FROM crimes;",
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to HQ
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground tracking-wide">SQL QUERY CONSOLE</h1>
              <p className="text-xs text-muted-foreground font-mono">DIRECT DATABASE ACCESS</p>
            </div>
          </div>

          {/* Sample Queries */}
          <div className="mb-4 flex flex-wrap gap-2">
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => setQuery(sq)}
                className="text-xs font-mono px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                {sq.length > 50 ? sq.slice(0, 50) + "..." : sq}
              </button>
            ))}
          </div>

          {/* Query Editor */}
          <div className="detective-card glow-border p-4 mb-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full bg-muted text-foreground font-mono text-sm p-4 rounded-md border border-border resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter SQL query..."
              spellCheck={false}
            />
            <Button onClick={runQuery} className="mt-3 font-display tracking-wider">
              <Play className="w-4 h-4 mr-2" /> EXECUTE QUERY
            </Button>
          </div>

          {/* Results */}
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="detective-card p-4">
              {result.error ? (
                <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-md border border-accent/30">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-sm text-accent font-mono">{result.error}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-mono text-muted-foreground mb-3">
                    {result.rows.length} ROW(S) RETURNED
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {result.columns.map((col) => (
                            <th key={col} className="text-left p-2 text-xs font-mono text-primary font-semibold whitespace-nowrap">
                              {col.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-border/50 hover:bg-muted/50">
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-2 text-xs font-mono text-secondary-foreground whitespace-nowrap max-w-[200px] truncate">
                                {String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
