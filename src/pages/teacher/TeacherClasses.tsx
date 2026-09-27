import React, { useState, useEffect } from 'react';
import { Layers, Users, CalendarCheck, Award, ArrowRight, Eye, BookOpen } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { ClassRoom } from '../../types';
import { Modal } from '../../components/common/Modal';

export const TeacherClasses: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);

  useEffect(() => {
    academicService.getClasses().then((cls) => {
      // Show teacher assigned classes
      setClasses(cls.filter((c) => c.classTeacherId === 'usr_t1' || c.id === 'cls_csea' || c.id === 'cls_cseb'));
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Assigned Classes & Sections</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Curricular sections delegated to Prof. Anitha Vasudevan for instruction and roll-call
        </p>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {cls.roomNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{cls.name}</h3>
                <p className="text-xs text-slate-500">{cls.department}</p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                {cls.totalStudents} Students
              </span>
            </div>

            {/* Attendance Status Box */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans uppercase font-semibold">Today's Forenoon</span>
                <div className="text-lg font-bold text-blue-700 mt-0.5">{cls.todayFnRate}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans uppercase font-semibold">Today's Afternoon</span>
                <div className="text-lg font-bold text-amber-700 mt-0.5">{cls.todayAnRate}%</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedClass(cls)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Class Details</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/teacher/marks')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  Marks
                </button>
                <button
                  onClick={() => onNavigate('/teacher/attendance')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Take Roll</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Details Drawer Modal */}
      {selectedClass && (
        <Modal
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
          title={`Section Roster: ${selectedClass.name}`}
          subtitle={`Location: ${selectedClass.roomNumber} · Capacity: ${selectedClass.totalStudents}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-900">Curricular Syllabus Overview:</div>
              <p className="text-slate-600 leading-relaxed">
                Core subjects taught this semester include Data Structures & Algorithms (CS301), Database Management Systems (CS302), and Software Engineering Lab.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedClass(null);
                  onNavigate('/teacher/attendance');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Launch Roll-Call Matrix
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
