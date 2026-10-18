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

export const priorityExams = priorityExamNames
  .map((name) => examRequirements.find((exam) => exam.name === name))
  .filter((exam): exam is NonNullable<typeof exam> => Boolean(exam));

export function getExamBySlug(slug: string) {
  return priorityExams.find((exam) => examSlug(exam.name) === slug);
}
