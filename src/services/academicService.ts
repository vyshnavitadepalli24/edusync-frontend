import {
  Student,
  Teacher,
  Parent,
  ClassRoom,
  ExamMarkRecord,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_PARENTS,
  INITIAL_CLASSES,
  INITIAL_EXAM_MARKS,
} from '../data/mockData';

let studentsStore = [...INITIAL_STUDENTS];
let teachersStore = [...INITIAL_TEACHERS];
let parentsStore = [...INITIAL_PARENTS];
let classesStore = [...INITIAL_CLASSES];
let examMarksStore = [...INITIAL_EXAM_MARKS];

export const academicService = {
  async getStudents(classId?: string): Promise<Student[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (!classId) return [...studentsStore];
    return studentsStore.filter((s) => s.classId === classId);
  },

  async getStudentById(id: string): Promise<Student | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return studentsStore.find((s) => s.id === id);
  },

  async addStudent(studentData: Omit<Student, 'id' | 'overallAttendanceRate' | 'fnAttendanceRate' | 'anAttendanceRate' | 'gpa'>): Promise<Student> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newStudent: Student = {
      ...studentData,
      id: `std_${Date.now()}`,
      overallAttendanceRate: 100,
      fnAttendanceRate: 100,
      anAttendanceRate: 100,
      gpa: 8.5,
    };
    studentsStore.unshift(newStudent);
    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const idx = studentsStore.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    studentsStore[idx] = { ...studentsStore[idx], ...updates };
    return studentsStore[idx];
  },

  async getTeachers(): Promise<Teacher[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...teachersStore];
  },

  async addTeacher(teacherData: Omit<Teacher, 'id' | 'status'>): Promise<Teacher> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newTeacher: Teacher = {
      ...teacherData,
      id: `usr_t_${Date.now()}`,
      status: 'Active',
    };
    teachersStore.unshift(newTeacher);
    return newTeacher;
  },

  async getParents(): Promise<Parent[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...parentsStore];
  },

  async getClasses(): Promise<ClassRoom[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...classesStore];
  },

  async getClassById(classId: string): Promise<ClassRoom | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return classesStore.find((c) => c.id === classId);
  },

  async getExamMarks(filters: { classId?: string; studentId?: string; examName?: string }): Promise<ExamMarkRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return examMarksStore.filter((m) => {
      if (filters.classId && m.classId !== filters.classId) return false;
      if (filters.studentId && m.studentId !== filters.studentId) return false;
      if (filters.examName && m.examName !== filters.examName) return false;
      return true;
    });
  },

  async saveExamMarks(marks: ExamMarkRecord[]): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    marks.forEach((newMark) => {
      const idx = examMarksStore.findIndex((m) => m.id === newMark.id);
      if (idx !== -1) {
        examMarksStore[idx] = newMark;
      } else {
        examMarksStore.push(newMark);
      }
    });
    return true;
  },

  calculateGrade(marks: number, max: number): string {
    const pct = (marks / max) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  },
};
