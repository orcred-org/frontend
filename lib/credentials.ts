import { SCORE_CRITERIA } from "./scoring";

export interface VerifyCredentialData {
  credential_id: string;
  issued_at: string;
  student_name: string;
  project_name: string | null;
  tech_stack: string | null;
  score: {
    total: number;
    technical_depth: number;
    communication: number;
    reproducibility: number;
    problem_solving: number;
    passed: boolean;
  } | null;
  verified: boolean;
}

export function formatCredentialStack(techStack: string | null | undefined): string {
  if (!techStack?.trim()) return "";
  return techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(" · ");
}

export function formatCredentialDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function mapVerifyToCredentialProps(data: VerifyCredentialData) {
  const stack = formatCredentialStack(data.tech_stack);
  const dimensions = SCORE_CRITERIA.map((c) => ({
    label: c.label,
    score: (data.score?.[c.key as keyof NonNullable<VerifyCredentialData["score"]>] as number) ?? 0,
  }));

  return {
    project: data.project_name?.trim() || "Verified project",
    stack,
    totalScore: data.score?.total ?? 0,
    dimensions,
    passed: data.score?.passed ?? false,
    id: data.credential_id,
    studentName: data.student_name,
    issuedLabel: formatCredentialDate(data.issued_at),
  };
}
