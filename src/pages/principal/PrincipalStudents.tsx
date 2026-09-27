import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  CalendarCheck,
  Award,
  GraduationCap,
  Filter,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Student } from '../../types';
import { StatusBadge } from '../../components/common/Badges';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const PrincipalStudents: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New student form state
  const [newName, setNewName] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newClass, setNewClass] = useState('cls_csea');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  useEffect(() => {
    academicService.getStudents().then(setStudents);
  }, []);

  const filteredStudents = students.filter((s) => {
    if (classFilter !== 'ALL' && s.classId !== classFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      const matchParent = s.parentName.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchParent) return false;
    }
    return true;
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRoll) return;

    const created = await academicService.addStudent({
      name: newName,
      rollNo: newRoll,
      classId: newClass,
      className: newClass === 'cls_csea' ? 'CSE - 3rd Year (Sec A)' : 'ECE - 2nd Year (Sec A)',
      section: 'A',
      gender: newGender,
      parentName: newParentName || 'Parent Guardian',
      parentPhone: newParentPhone || '+91 98400 00000',
      parentEmail: newParentEmail || 'parent@edunexus.edu',
      status: 'Active',
    });

    setStudents((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewRoll('');
    setNewParentName('');
    setNewParentPhone('');
    setNewParentEmail('');

    addToast({
      type: 'success',
      title: 'Student Admitted',
      message: `${created.name} (${created.rollNo}) successfully added to institutional roster.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional pupil directory, parent linkage, and holistic academic standing
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
          >
            <option value="ALL">All Classes & Sections</option>
            <option value="cls_csea">CSE - 3rd Year (Sec A)</option>
            <option value="cls_cseb">CSE - 3rd Year (Sec B)</option>
            <option value="cls_ecea">ECE - 2nd Year (Sec A)</option>
            <option value="cls_mecha">MECH - 3rd Year (Sec A)</option>
          </select>
          <span className="text-xs text-slate-500 font-mono">
            {filteredStudents.length} students found
          </span>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by student name, roll number, or parent..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Class & Section</th>
                <th className="px-5 py-3">Guardian Details</th>
                <th className="px-5 py-3">Overall Attendance</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const isWarning = std.overallAttendanceRate < 75;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-900 tabular-nums">
                        {std.rollNo}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{std.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">GPA: {std.gpa} / 10</div>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-slate-700">
                        {std.className}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800">{std.parentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{std.parentPhone}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold tabular-nums ${
                              isWarning ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {std.overallAttendanceRate}%
                          </span>
                          {isWarning && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                              Shortage
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          FN: {std.fnAttendanceRate}% · AN: {std.anAttendanceRate}%
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusBadge status={std.status} />
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedStudent(std)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title="View Student Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onNavigate('/principal/attendance')}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Attendance Matrix"
                          >
                            <CalendarCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Student Dossier Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile: ${selectedStudent.name}`}
          subtitle={`Roll: ${selectedStudent.rollNo} · ${selectedStudent.className}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium text-[10px] uppercase">Gender & Status</span>
                <div className="font-semibold text-slate-800">{selectedStudent.gender} · {selectedStudent.status}</div>
                <div className="text-slate-500 font-mono mt-1">GPA: {selectedStudent.gpa} / 10</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] uppercase">Primary Guardian</span>
                <div className="font-semibold text-slate-800">{selectedStudent.parentName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{selectedStudent.parentPhone}</div>
                <div className="text-slate-500 text-[11px]">{selectedStudent.parentEmail}</div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <span className="font-bold text-blue-950 uppercase tracking-wider text-[11px]">
                Session Attendance Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 font-sans">Overall Rate</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedStudent.overallAttendanceRate}%</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-emerald-600 font-sans">Forenoon (FN)</div>
                  <div className="font-bold text-emerald-700 text-sm">{selectedStudent.fnAttendanceRate}%</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-amber-600 font-sans">Afternoon (AN)</div>
                  <div className="font-bold text-amber-700 text-sm">{selectedStudent.anAttendanceRate}%</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Admit New Student to Institution"
          subtitle="Register student record and synchronize parent linkage"
        >
          <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Siddharth Menon"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Roll Number</label>
                <input
                  type="text"
                  required
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  placeholder="e.g. 21CS011"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Class & Section</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                >
                  <option value="cls_csea">CSE - 3rd Year (Sec A)</option>
                  <option value="cls_cseb">CSE - 3rd Year (Sec B)</option>
                  <option value="cls_ecea">ECE - 2nd Year (Sec A)</option>
                  <option value="cls_mecha">MECH - 3rd Year (Sec A)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Gender</label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700">Parent / Guardian Name</label>
              <input
                type="text"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                placeholder="e.g. Radhakrishnan Menon"
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Parent Phone</label>
                <input
                  type="text"
                  value={newParentPhone}
                  onChange={(e) => setNewParentPhone(e.target.value)}
                  placeholder="+91 98401 99999"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Parent Email</label>
                <input
                  type="email"
                  value={newParentEmail}
                  onChange={(e) => setNewParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Enroll Student
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
