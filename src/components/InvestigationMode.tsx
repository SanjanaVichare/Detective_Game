import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Crosshair,
  Lightbulb,
  Trophy,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type QueryResult = {
  columns: string[];
  rows: any[][];
  error?: string;
};

type CaseStatus = "active" | "solved" | "failed";

const cases = [
  {
    id: "case-001",
    title: "The Mumbai Bank Heist",
    story:
      "A suspect was seen fleeing a bank robbery in Mumbai. Witnesses say he has BROWN eyes and a SCAR on his LEFT CHEEK. Intelligence reports confirm his crime type is ROBBERY.",
    answer: "Ravi Sharma",
    hints: [
      "Try filtering by eye_color = 'BROWN'",
      "Add a WHERE clause for distinguishing_marks like '%SCAR%'",
      "Combine eye_color, marks, AND crime_type = 'ROBBERY' for precision",
    ],
    suggestedQuery:
      "SELECT * FROM criminals WHERE eye_color = 'BROWN' AND distinguishing_marks LIKE '%SCAR%' AND crime_type = 'ROBBERY';",
  },
  {
    id: "case-002",
    title: "The Delhi Fraud Ring",
    story:
      "A female suspect involved in financial FRAUD was last seen in Delhi. She has GREEN eyes and walks with a noticeable LIMP.",
    answer: "Aisha Khan",
    hints: [
      "Filter by gender = 'FEMALE' to narrow results",
      "Look for eye_color = 'GREEN'",
      "Add physical_condition LIKE '%LIMP%' to pinpoint the suspect",
    ],
    suggestedQuery:
      "SELECT * FROM criminals WHERE gender = 'FEMALE' AND eye_color = 'GREEN' AND physical_condition LIKE '%LIMP%';",
  },
  {
    id: "case-003",
    title: "The Goa Smuggler",
    story:
      "A dangerous smuggler was spotted near the Goa docks. Witnesses say he has BLUE eyes and a burn mark on his RIGHT ARM.",
    answer: "John Dsouza",
    hints: [
      "Start with eye_color = 'BLUE'",
      "Look for distinguishing_marks mentioning a burn",
      "Add location = 'GOA' to narrow the search further",
    ],
    suggestedQuery:
      "SELECT * FROM criminals WHERE eye_color = 'BLUE' AND distinguishing_marks LIKE '%BURN%';",
  },
];

const SCHEMA_INFO = `criminals(
  id, name, gender, age,
  eye_color, distinguishing_marks,
  physical_condition, crime_type,
  last_seen_location
)`;

export default function InvestigationMode() {
  const navigate = useNavigate();

  const [caseIndex, setCaseIndex] = useState(0);
  const [query, setQuery] = useState("SELECT * FROM criminals;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [caseStatus, setCaseStatus] = useState<CaseStatus>("active");
  const [score, setScore] = useState(0);
  const [hintIndex, setHintIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "warning" | null;
    message: string;
  }>({ type: null, message: "" });
  const [elapsed, setElapsed] = useState(0);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [showSchema, setShowSchema] = useState(false);
  const [allSolved, setAllSolved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentCase = cases[caseIndex];

  // Timer per case
  useEffect(() => {
    if (caseStatus === "active") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [caseIndex, caseStatus]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const resetCase = () => {
    setQuery("SELECT * FROM criminals;");
    setResult(null);
    setCaseStatus("active");
    setHintIndex(-1);
    setFeedback({ type: null, message: "" });
    setQueryHistory([]);
  };

  const showNextHint = () => {
    const next = hintIndex + 1;
    if (next < currentCase.hints.length) {
      setHintIndex(next);
    }
  };

  const useSuggestedQuery = () => {
    setQuery(currentCase.suggestedQuery);
    textareaRef.current?.focus();
  };

  const runInvestigation = async () => {
    if (!query.trim()) {
      setFeedback({ type: "warning", message: "Please enter a SQL query." });
      return;
    }

    // Basic SQL safety check
    const dangerous = /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE)\b/i.test(query);
    if (dangerous) {
      setFeedback({
        type: "error",
        message: "⚠️ Destructive queries are not allowed in investigation mode.",
      });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: null, message: "" });

    // Track query history
    setQueryHistory((prev) =>
      prev.includes(query) ? prev : [query, ...prev].slice(0, 5)
    );

    try {
      const res = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data: QueryResult = await res.json();
      setResult(data);

      if (data.error) {
        setFeedback({ type: "error", message: `SQL Error: ${data.error}` });
        return;
      }

      if (data.rows.length === 0) {
        setFeedback({
          type: "warning",
          message: "No suspects found. Try broadening your query.",
        });
        return;
      }

      // Try to find name in any column
      const nameColIndex = data.columns.findIndex((c) =>
        c.toLowerCase().includes("name")
      );
      const checkIndex = nameColIndex >= 0 ? nameColIndex : 1;

      const matchedRow = data.rows.find(
        (row) => row[checkIndex] === currentCase.answer
      );

      // Must return EXACTLY 1 row and it must be the correct suspect
      if (data.rows.length > 1) {
        setFeedback({
          type: "warning",
          message: `Too many suspects (${data.rows.length} returned). Narrow your query — you must pinpoint exactly 1 person.`,
        });
        return;
      }

      if (data.rows.length === 1 && matchedRow) {
        setCaseStatus("solved");
        setScore((s) => s + Math.max(10 - hintIndex * 2, 4));
        setFeedback({
          type: "success",
          message: `✅ Suspect identified: ${currentCase.answer}`,
        });

        setTimeout(() => {
          if (caseIndex < cases.length - 1) {
            setCaseIndex((i) => i + 1);
            resetCase();
          } else {
            setAllSolved(true);
          }
        }, 2000);
      } else {
        setFeedback({
          type: "error",
          message: `❌ Wrong suspect returned. Check your WHERE conditions and try again.`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Could not reach the server. Is the backend running?",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runInvestigation();
    }
  };

  if (allSolved) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="detective-card p-10 text-center max-w-md"
        >
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">All Cases Solved!</h1>
          <p className="text-muted-foreground mb-4">
            Excellent detective work. Every criminal has been identified.
          </p>
          <div className="text-5xl font-mono font-bold text-accent mb-6">
            {score} pts
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setCaseIndex(0);
                setScore(0);
                setAllSolved(false);
                resetCase();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Back to HQ
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to HQ
          </Button>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatTime(elapsed)}
            </span>
            <span className="text-accent font-bold">Score: {score}</span>
          </div>
        </div>

        <motion.div
          key={caseIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Case Header */}
          <div className="flex items-center gap-3 mb-2">
            <Crosshair className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold">{currentCase.title}</h1>
            <span className="ml-auto text-sm font-mono text-muted-foreground">
              Case {caseIndex + 1} / {cases.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted h-1.5 rounded-full mb-6">
            <div
              className="h-1.5 bg-accent rounded-full transition-all duration-500"
              style={{ width: `${((caseIndex) / cases.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Case description */}
            <div className="lg:col-span-2 detective-card p-6">
              <h2 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                Case Briefing
              </h2>
              <p className="leading-relaxed mb-4">{currentCase.story}</p>
              <div className="flex items-center gap-2 text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded px-3 py-2">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Your query must return <strong className="mx-1">exactly 1 suspect</strong> — the right one. Returning the whole table won't work.
              </div>
            </div>

            {/* Hints panel */}
            <div className="detective-card p-4 flex flex-col gap-3">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Detective Hints
              </h2>

              {hintIndex === -1 && (
                <p className="text-sm text-muted-foreground">
                  Stuck? Request a hint — but each one costs 2 points.
                </p>
              )}

              <AnimatePresence>
                {currentCase.hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm bg-muted p-2 rounded font-mono border-l-2 border-accent"
                  >
                    {hint}
                  </motion.div>
                ))}
              </AnimatePresence>

              {hintIndex < currentCase.hints.length - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showNextHint}
                  className="mt-auto"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Get Hint (-2 pts)
                </Button>
              )}

              {hintIndex === currentCase.hints.length - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={useSuggestedQuery}
                  className="mt-auto"
                >
                  <ChevronRight className="w-3 h-3 mr-1" />
                  Use Solution Query
                </Button>
              )}
            </div>
          </div>

          {/* SQL Editor */}
          <div className="detective-card p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                SQL Query Editor
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSchema((s) => !s)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Database className="w-3 h-3" />
                  {showSchema ? "Hide" : "Show"} Schema
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showSchema && (
                <motion.pre
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-xs font-mono bg-muted p-3 rounded mb-3 text-muted-foreground overflow-hidden"
                >
                  {SCHEMA_INFO}
                </motion.pre>
              )}
            </AnimatePresence>

            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              className="w-full bg-muted p-3 font-mono text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Write your SQL query here..."
              disabled={caseStatus === "solved"}
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                Ctrl+Enter to run
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCase}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
                <Button
                  onClick={runInvestigation}
                  disabled={isLoading || caseStatus === "solved"}
                  size="sm"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Run Query
                </Button>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback.type && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 p-3 rounded flex items-center gap-2 text-sm font-medium ${feedback.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : feedback.type === "error"
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                  }`}
              >
                {feedback.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                {feedback.type === "error" && <XCircle className="w-4 h-4" />}
                {feedback.type === "warning" && <AlertTriangle className="w-4 h-4" />}
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Query History */}
          {queryHistory.length > 1 && (
            <div className="detective-card p-4 mb-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Recent Queries
              </h3>
              <div className="flex flex-col gap-1">
                {queryHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(q)}
                    className="text-xs font-mono text-left truncate text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Table */}
          <AnimatePresence>
            {result && !result.error && result.rows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="detective-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Query Results
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {result.rows.length} row(s)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        {result.columns.map((col) => (
                          <th
                            key={col}
                            className="text-left py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => {
                        const nameColIndex = result.columns.findIndex((c) =>
                          c.toLowerCase().includes("name")
                        );
                        const checkIdx = nameColIndex >= 0 ? nameColIndex : 1;
                        const isMatch = row[checkIdx] === currentCase.answer;
                        return (
                          <tr
                            key={i}
                            className={`border-b border-border/50 transition-colors ${isMatch
                              ? "bg-green-500/10"
                              : "hover:bg-muted/50"
                              }`}
                          >
                            {row.map((cell, j) => (
                              <td key={j} className="py-2 px-3 font-mono text-xs">
                                {cell ?? "—"}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}