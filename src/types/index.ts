export type UserRole = 'principal' | 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string;
  department?: string;
  phone?: string;
  assignedClass?: string;
  childStudentId?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  className: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  overallAttendanceRate: number; // e.g. 88%
  fnAttendanceRate: number;
  anAttendanceRate: number;
  gpa: number;
  avatar?: string;
  status: 'Active' | 'On Leave' | 'Suspended';
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  classes: string[];
  subjects: string[];
  totalStudents: number;
  status: 'Active' | 'On Leave';
  avatar?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentClass: string;
  occupation: string;
  address: string;
  status: 'Verified' | 'Pending';
}

export interface ClassRoom {
  id: string;
  name: string; // e.g., 'Grade 10-A' or 'CSE 3rd Year - Sec A'
  department: string;
  section: string;
  classTeacherId: string;
  classTeacherName: string;
  totalStudents: number;
  todayFnRate: number;
  todayAnRate: number;
  roomNumber: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  classId: string;
  date: string; // YYYY-MM-DD
  fnStatus: AttendanceStatus;
  anStatus: AttendanceStatus;
  remarks?: string;
  markedByTeacherId: string;
  isLocked: boolean;
}

export interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
}

export interface ExamMarkRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  classId: string;
  examName: string; // 'Mid-Term 1', 'Semester End', 'Unit Test 2'
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  status: 'Submitted' | 'Verified' | 'Correction Requested';
  date: string;
}

export type CorrectionRecordType = 'attendance_fn' | 'attendance_an' | 'exam_marks';

export interface CorrectionRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  className: string;
  subjectOrDate: string; // e.g. "Data Structures" or "2026-09-26"
  recordType: CorrectionRecordType;
  originalValue: string;
  proposedValue: string;
  reason: string;
  submittedDate: string;
  aiConfidence: number; // e.g. 92%
  aiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  aiExplanation: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedDate?: string;
  reviewRemarks?: string;
}

export interface AIAnomaly {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  className: string;
  date: string;
  fnStatus: AttendanceStatus;
  anStatus: AttendanceStatus;
  anomalyType: 'Session Skipping' | 'Sudden Drop' | 'Streak Absence' | 'Inconsistent Trend';
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  detectedAt: string;
  isReviewed: boolean;
  reviewedNotes?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole;
  recipientId?: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'ai';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AIParentSummary {
  studentId: string;
  studentName: string;
  overallAttendance: number;
  fnAttendance: number;
  anAttendance: number;
  overallGpa: number;
  summaryText: string;
  academicStrengths: string[];
  attendanceConcerns: string[];
  recommendedAttention: string[];
  lastGenerated: string;
}
