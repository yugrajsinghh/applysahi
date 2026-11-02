import { examRequirements } from './exam-requirements';

export const priorityExamNames = [
  'NEET (UG)', 'JEE (Main)', 'JEE (Advanced)', 'GATE', 'CUET (UG)',
  'CUET (PG)', 'SSC CGL', 'SSC CHSL', 'UPSC Civil Services Examination',
  'IBPS PO / MT', 'IBPS Customer Service Associate', 'SBI Probationary Officer',
  'RBI Grade B', 'CAT', 'CLAT',
] as const;

export function examSlug(name: string) {
  return name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Every verified entry gets its own indexable guide. `priorityExamNames` remains
// available for places that want to highlight the most searched exams first.
export const priorityExams = examRequirements;

export function getExamBySlug(slug: string) {
  return priorityExams.find((exam) => examSlug(exam.name) === slug);
}
