export interface ISO27001Control {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  maturityLevel: 0 | 1 | 2 | 3 | 4; // 0: Non implemented, 1: Initial, 2: Repeatable, 3: Defined, 4: Managed
  evidence: string[];
  gaps: string[];
  actionPlan: ISO27001Action[];
  lastAssessment?: string;
  nextReview?: string;
  responsible: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "not_started" | "in_progress" | "implemented" | "reviewed";
}

export interface ISO27001Action {
  id: string;
  title: string;
  description: string;
  responsible: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "not_started" | "in_progress" | "completed" | "overdue";
  workflowId?: string; // Reference to workflow execution
  estimatedCost?: number;
  category: string;
  dependencies?: string[]; // Other action IDs
  progress: number; // 0-100%
}

export interface ISO27001Category {
  id: string;
  name: string;
  description: string;
  controls: ISO27001Control[];
  overallMaturity: number;
  totalControls: number;
  implementedControls: number;
}

export interface ISO27001Assessment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  assessor: string;
  scope: string;
  categories: ISO27001Category[];
  overallMaturity: number;
  totalActions: number;
  completedActions: number;
  status: "draft" | "in_progress" | "completed" | "reviewed";
}

export interface MaturityLevel {
  level: number;
  name: string;
  description: string;
  characteristics: string[];
  color: string;
}

export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    level: 0,
    name: "Non Implémenté",
    description: "Le contrôle n'est pas en place",
    characteristics: ["Aucun processus défini", "Pas de documentation", "Pas de responsabilité assignée"],
    color: "bg-red-500"
  },
  {
    level: 1,
    name: "Initial",
    description: "Processus ad hoc et imprévisibles",
    characteristics: ["Processus informels", "Documentation limitée", "Dépendant des individus"],
    color: "bg-orange-500"
  },
  {
    level: 2,
    name: "Reproductible",
    description: "Processus caractérisés et disciplinés",
    characteristics: ["Processus documentés", "Formation du personnel", "Contrôles de base"],
    color: "bg-yellow-500"
  },
  {
    level: 3,
    name: "Défini",
    description: "Processus standardisés et cohérents",
    characteristics: ["Processus standardisés", "Métriques définies", "Amélioration continue"],
    color: "bg-blue-500"
  },
  {
    level: 4,
    name: "Géré",
    description: "Processus mesurés et contrôlés",
    characteristics: ["Mesures quantitatives", "Contrôle statistique", "Prédictibilité élevée"],
    color: "bg-green-500"
  }
];