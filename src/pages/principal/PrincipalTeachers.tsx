import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Layers,
  Edit2,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Teacher } from '../../types';
import { StatusBadge } from '../../components/common/Badges';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const PrincipalTeachers: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { addToast } = useToast();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [assignClassTeacher, setAssignClassTeacher] = useState<Teacher | null>(null);
  const [newAssignedClass, setNewAssignedClass] = useState('CSE - 4th Year (Sec A)');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [dept, setDept] = useState('Computer Science & Engineering');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    academicService.getTeachers().then(setTeachers);
  }, []);

  const filteredTeachers = teachers.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchEmp = t.employeeId.toLowerCase().includes(q);
      const matchDept = t.department.toLowerCase().includes(q);
      if (!matchName && !matchEmp && !matchDept) return false;
    }
    return true;
  });

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const created = await academicService.addTeacher({
      name,
      employeeId: empId || `EMP-${Date.now().toString().slice(-4)}`,
      department: dept,
      email,
      phone: phone || '+91 98400 11111',
      classes: ['CSE - 2nd Year (Sec B)'],
      subjects: ['Software Engineering'],
      totalStudents: 30,
    });

    setTeachers((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setEmpId('');

    addToast({
      type: 'success',
      title: 'Faculty Appointed',
      message: `${created.name} registered in ${created.department}.`,
    });
  };

  const handleAssignClassSubmit = () => {
    if (!assignClassTeacher) return;
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === assignClassTeacher.id
          ? { ...t, classes: [...new Set([...t.classes, newAssignedClass])] }
          : t
      )
    );
    addToast({
      type: 'success',
      title: 'Class Assigned',
      message: `${newAssignedClass} assigned to ${assignClassTeacher.name}.`,
    });
    setAssignClassTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Faculty Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic faculty roster, course allocations, and daily attendance authoring rights
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-mono">
          {filteredTeachers.length} Active Faculty Members
        </span>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by faculty name, department or ID..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-100">
                  {t.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{t.name}</h3>
                  <div className="text-[11px] text-slate-500 font-mono">{t.employeeId} · {t.department}</div>
                </div>
              </div>

              <StatusBadge status={t.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-mono truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{t.phone}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Assigned Classes ({t.classes.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.classes.map((cls, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Student Load: <strong className="text-slate-800">{t.totalStudents}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAssignClassTeacher(t)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  Assign Class
                </button>
                <button
                  onClick={() => setSelectedTeacher(t)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  View Dossier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Class Modal */}
      {assignClassTeacher && (
        <Modal
          isOpen={!!assignClassTeacher}
          onClose={() => setAssignClassTeacher(null)}
          title={`Assign Class to ${assignClassTeacher.name}`}
          subtitle={`Department: ${assignClassTeacher.department}`}
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Select Section to Delegate:</label>
              <select
                value={newAssignedClass}
                onChange={(e) => setNewAssignedClass(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
              >
                <option value="CSE - 4th Year (Sec A)">CSE - 4th Year (Sec A)</option>
                <option value="CSE - 2nd Year (Sec B)">CSE - 2nd Year (Sec B)</option>
                <option value="ECE - 3rd Year (Sec A)">ECE - 3rd Year (Sec A)</option>
                <option value="MECH - 2nd Year (Sec B)">MECH - 2nd Year (Sec B)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setAssignClassTeacher(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignClassSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Confirm Delegation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Teacher Dossier Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          title={`Faculty Profile: ${selectedTeacher.name}`}
          subtitle={`Employee Code: ${selectedTeacher.employeeId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Department</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedTeacher.department}</div>
                <div className="text-slate-500 font-mono mt-1">{selectedTeacher.email}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Phone & Load</span>
                <div className="font-mono text-slate-800 mt-0.5">{selectedTeacher.phone}</div>
                <div className="text-slate-600 font-bold mt-1">{selectedTeacher.totalStudents} Active Students</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-slate-700">Subjects Instructed:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                {selectedTeacher.subjects.map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Appoint New Faculty Member"
          subtitle="Assign departmental credentials and timetable roster"
        >
          <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Harish Nambiar"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Employee ID</label>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="e.g. EMP-CS-052"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edunexus.edu"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98401 22222"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
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
                Save Faculty Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
