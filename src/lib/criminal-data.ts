// Criminal Investigation Database - In-memory data store
// In production, this would connect to MySQL via an API

export interface Criminal {
  criminal_id: string;
  name: string;
  gender: string;
  age: number;
  eye_color: string;
  hair_color: string;
  height: string;
  scar_location: string;
  distinctive_features: string;
  last_known_location: string;
  crime_type: string;
  threat_level: "High" | "Medium" | "Low";
  photo_url?: string;
}

export interface Crime {
  crime_id: string;
  criminal_id: string;
  crime_name: string;
  crime_date: string;
  location: string;
  description: string;
}

export interface Detective {
  detective_id: string;
  name: string;
  rank: string;
}

// Sample criminal data
const initialCriminals: Criminal[] = [
  {
    criminal_id: "CR-001",
    name: "Viktor Kozlov",
    gender: "Male",
    age: 42,
    eye_color: "Brown",
    hair_color: "Black",
    height: "6'1\"",
    scar_location: "Left cheek",
    distinctive_features: "Tattoo on neck, limps on right leg",
    last_known_location: "Downtown warehouse district",
    crime_type: "Armed Robbery",
    threat_level: "High",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    criminal_id: "CR-002",
    name: "Elena Marchetti",
    gender: "Female",
    age: 35,
    eye_color: "Green",
    hair_color: "Red",
    height: "5'7\"",
    scar_location: "Right forearm",
    distinctive_features: "Birthmark on left hand",
    last_known_location: "Harbor district",
    crime_type: "Fraud",
    threat_level: "Medium",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    criminal_id: "CR-003",
    name: "Marcus Stone",
    gender: "Male",
    age: 29,
    eye_color: "Blue",
    hair_color: "Blonde",
    height: "5'10\"",
    scar_location: "Above right eyebrow",
    distinctive_features: "Missing pinky finger, spider web tattoo on elbow",
    last_known_location: "Eastside apartments",
    crime_type: "Assault",
    threat_level: "High",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
  {
    criminal_id: "CR-004",
    name: "Jade Chen",
    gender: "Female",
    age: 31,
    eye_color: "Brown",
    hair_color: "Black",
    height: "5'4\"",
    scar_location: "None",
    distinctive_features: "Dragon tattoo on back, wears colored contacts",
    last_known_location: "Chinatown",
    crime_type: "Cybercrime",
    threat_level: "Medium",
    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
  {
    criminal_id: "CR-005",
    name: "Dmitri Volkov",
    gender: "Male",
    age: 48,
    eye_color: "Grey",
    hair_color: "Grey",
    height: "6'3\"",
    scar_location: "Across throat",
    distinctive_features: "Gold tooth, walks with a cane",
    last_known_location: "Northside industrial zone",
    crime_type: "Murder",
    threat_level: "High",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    criminal_id: "CR-006",
    name: "Sarah Blake",
    gender: "Female",
    age: 27,
    eye_color: "Blue",
    hair_color: "Blonde",
    height: "5'6\"",
    scar_location: "Left shoulder",
    distinctive_features: "Rose tattoo on wrist",
    last_known_location: "Suburbs, Oak Avenue",
    crime_type: "Theft",
    threat_level: "Low",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
  },
];

const initialCrimes: Crime[] = [
  { crime_id: "CM-001", criminal_id: "CR-001", crime_name: "Bank Heist", crime_date: "2025-11-15", location: "First National Bank", description: "Armed robbery netting $2.3M" },
  { crime_id: "CM-002", criminal_id: "CR-002", crime_name: "Insurance Fraud", crime_date: "2025-09-20", location: "Harbor Insurance Co.", description: "Fraudulent claims totaling $500K" },
  { crime_id: "CM-003", criminal_id: "CR-003", crime_name: "Bar Fight Assault", crime_date: "2026-01-05", location: "The Rusty Nail Bar", description: "Aggravated assault with weapon" },
  { crime_id: "CM-004", criminal_id: "CR-005", crime_name: "Homicide", crime_date: "2025-08-12", location: "Northside Warehouse", description: "First-degree murder, organized crime" },
];

// In-memory store
let criminals = [...initialCriminals];
let crimes = [...initialCrimes];

export async function getCriminals(): Promise<Criminal[]> {
  const res = await fetch("http://localhost:5000/criminals");
  return await res.json();
}

export function getCrimes(): Crime[] {
  return [...crimes];
}

export async function addCriminal(criminal: any) {
  const res = await fetch("http://localhost:5000/criminals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(criminal),
  });

  return await res.json();
}

export async function searchCriminals(filters: any) {
  const res = await fetch("http://localhost:5000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  return await res.json();
}

// Simple SQL-like query parser for the console
export function executeQuery(query: string): { columns: string[]; rows: any[][]; error?: string } {
  try {
    const q = query.trim().toLowerCase();

    if (!q.startsWith("select")) {
      return { columns: [], rows: [], error: "Only SELECT queries are supported in this demo." };
    }

    // Determine table
    let data: any[] = [];
    let tableName = "";
    if (q.includes("from criminals")) {
      data = [...criminals];
      tableName = "criminals";
    } else if (q.includes("from crimes")) {
      data = [...crimes];
      tableName = "crimes";
    } else {
      return { columns: [], rows: [], error: "Table not found. Available tables: criminals, crimes" };
    }

    // Parse WHERE clause
    const whereMatch = query.match(/where\s+(.+?)(?:order|limit|$)/i);
    if (whereMatch) {
      const conditions = whereMatch[1].split(/\s+and\s+/i);
      for (const cond of conditions) {
        const match = cond.trim().match(/(\w+)\s*=\s*'([^']+)'/);
        if (match) {
          const [, field, value] = match;
          data = data.filter((row) => {
            const rowVal = String(row[field] || "").toLowerCase();
            return rowVal === value.toLowerCase();
          });
        }
        const likeMatch = cond.trim().match(/(\w+)\s+like\s+'%([^']+)%'/i);
        if (likeMatch) {
          const [, field, value] = likeMatch;
          data = data.filter((row) => {
            const rowVal = String(row[field] || "").toLowerCase();
            return rowVal.includes(value.toLowerCase());
          });
        }
      }
    }

    // Parse columns
    const selectMatch = query.match(/select\s+(.+?)\s+from/i);
    let columns: string[] = [];
    if (selectMatch) {
      const colStr = selectMatch[1].trim();
      if (colStr === "*") {
        columns = data.length > 0 ? Object.keys(data[0]) : [];
      } else {
        columns = colStr.split(",").map((c) => c.trim());
      }
    }

    const rows = data.map((row) => columns.map((col) => row[col] ?? "N/A"));

    return { columns, rows };
  } catch {
    return { columns: [], rows: [], error: "Invalid query syntax." };
  }
}

// SQL table creation queries (for reference)
export const SQL_CREATE_TABLES = `
-- MySQL Database Creation Queries
CREATE DATABASE IF NOT EXISTS criminal_db;
USE criminal_db;

CREATE TABLE criminals (
  criminal_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  age INT,
  eye_color VARCHAR(30),
  hair_color VARCHAR(30),
  height VARCHAR(10),
  scar_location VARCHAR(100),
  distinctive_features TEXT,
  last_known_location VARCHAR(200),
  crime_type VARCHAR(100),
  threat_level ENUM('High', 'Medium', 'Low') DEFAULT 'Low'
);

CREATE TABLE crimes (
  crime_id VARCHAR(10) PRIMARY KEY,
  criminal_id VARCHAR(10),
  crime_name VARCHAR(100),
  crime_date DATE,
  location VARCHAR(200),
  description TEXT,
  FOREIGN KEY (criminal_id) REFERENCES criminals(criminal_id)
);

CREATE TABLE detectives (
  detective_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rank VARCHAR(50)
);
`;
