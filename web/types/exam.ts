export interface Exam {
  id: string;
  university: string;
  examName: string;
  examDate: string;
  logo?: string;
  applicants?: number;
  seats?: number;
  careers?: Career[];
}

export interface Career {
  id: string;
  code: string;
  name: string;
  seats?: number;
  applicants?: number;
}

export interface Applicant {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  score: number;
  admitted?: boolean;
}
