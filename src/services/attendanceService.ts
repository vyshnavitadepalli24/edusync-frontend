import { AttendanceRecord, AttendanceStatus } from '../types';
import { INITIAL_TODAY_ATTENDANCE } from '../data/mockData';

// In-memory working copy for dynamic updates
let attendanceStore: AttendanceRecord[] = [...INITIAL_TODAY_ATTENDANCE];

export interface SaveAttendancePayload {
  classId: string;
  date: string;
  records: {
    studentId: string;
    studentRollNo: string;
    studentName: string;
    fnStatus: AttendanceStatus;
    anStatus: AttendanceStatus;
    remarks?: string;
  }[];
  markedByTeacherId: string;
}

export const attendanceService = {
  async getAttendance(filters: { classId?: string; date?: string }): Promise<AttendanceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return attendanceStore.filter((rec) => {
      if (filters.classId && rec.classId !== filters.classId) return false;
      if (filters.date && rec.date !== filters.date) return false;
      return true;
    });
  },

  async saveClassAttendance(payload: SaveAttendancePayload): Promise<{
    success: boolean;
    savedCount: number;
    anomaliesFound: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Remove old records for this class & date
    attendanceStore = attendanceStore.filter(
      (rec) => !(rec.classId === payload.classId && rec.date === payload.date)
    );

    let anomalies = 0;
    payload.records.forEach((r) => {
      attendanceStore.push({
        id: `att_${Date.now()}_${r.studentId}`,
        studentId: r.studentId,
        studentRollNo: r.studentRollNo,
        studentName: r.studentName,
        classId: payload.classId,
        date: payload.date,
        fnStatus: r.fnStatus,
        anStatus: r.anStatus,
        remarks: r.remarks,
        markedByTeacherId: payload.markedByTeacherId,
        isLocked: true,
      });

      // Simple rule: Present in FN, Absent in AN = Session Skipping anomaly
      if (r.fnStatus === 'present' && r.anStatus === 'absent') {
        anomalies++;
      }
    });

    return {
      success: true,
      savedCount: payload.records.length,
      anomaliesFound: anomalies,
    };
  },

  async getStudentMonthlyAttendance(studentId: string, _month: string): Promise<{
    date: string;
    dayName: string;
    fnStatus: AttendanceStatus;
    anStatus: AttendanceStatus;
  }[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    // Generate realistic 26 working days data for September 2026
    const days: { date: string; dayName: string; fnStatus: AttendanceStatus; anStatus: AttendanceStatus }[] = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= 27; day++) {
      const d = new Date(2026, 8, day);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0) continue; // Skip Sunday

      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      let fnStatus: AttendanceStatus = 'present';
      let anStatus: AttendanceStatus = 'present';

      // Specific known instances for demo realism
      if (day === 27) {
        fnStatus = 'present';
        anStatus = 'absent';
      } else if (day === 22) {
        fnStatus = 'present';
        anStatus = 'absent';
      } else if (day === 15) {
        fnStatus = 'present';
        anStatus = 'absent';
      } else if (day === 10) {
        fnStatus = 'absent';
        anStatus = 'absent';
      }

      days.push({
        date: dateStr,
        dayName: dayLabels[dayOfWeek],
        fnStatus,
        anStatus,
      });
    }

    return days;
  },

  calculateClassRates(records: AttendanceRecord[]): {
    fnRate: number;
    anRate: number;
    overallRate: number;
    presentCount: number;
    absentCount: number;
    anomalyCount: number;
  } {
    if (records.length === 0) {
      return { fnRate: 0, anRate: 0, overallRate: 0, presentCount: 0, absentCount: 0, anomalyCount: 0 };
    }
    const fnPresent = records.filter((r) => r.fnStatus === 'present').length;
    const anPresent = records.filter((r) => r.anStatus === 'present').length;
    const bothPresent = records.filter((r) => r.fnStatus === 'present' && r.anStatus === 'present').length;
    const fnOnly = records.filter((r) => r.fnStatus === 'present' && r.anStatus === 'absent').length;

    const fnRate = Math.round((fnPresent / records.length) * 1000) / 10;
    const anRate = Math.round((anPresent / records.length) * 1000) / 10;
    const overallRate = Math.round(((fnPresent + anPresent) / (records.length * 2)) * 1000) / 10;

    return {
      fnRate,
      anRate,
      overallRate,
      presentCount: bothPresent,
      absentCount: records.length - bothPresent,
      anomalyCount: fnOnly,
    };
  },
};
