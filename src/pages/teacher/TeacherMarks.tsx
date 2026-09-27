import React, { useState, useEffect } from 'react';
import {
  Award,
  Save,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { ExamMarkRecord } from '../../types';
import { useToast } from '../../context/ToastContext';

export const TeacherMarks: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { addToast } = useToast();

  const [selectedExam, setSelectedExam] = useState('Mid-Term 1');
  const [selectedClass, setSelectedClass] = useState('cls_csea');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms');

  const [marks, setMarks] = useState<ExamMarkRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  useEffect(() => {
    academicService
      .getExamMarks({ classId: selectedClass, examName: selectedExam })
      .then((records) => {
        setMarks(records);
        setIsSavedSuccessfully(false);
      });
  }, [selectedClass, selectedExam, selectedSubject]);

  const handleMarkChange = (id: string, val: string) => {
    const num = parseFloat(val);
    const newErrors = { ...errors };

    if (isNaN(num)) {
      newErrors[id] = 'Must be a valid number';
    } else if (num < 0) {
      newErrors[id] = 'Marks cannot be negative';
    } else if (num > 100) {
      newErrors[id] = 'Cannot exceed 100 marks';
    } else {
      delete newErrors[id];
    }

    setErrors(newErrors);

    setMarks((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const validNum = isNaN(num) ? 0 : num;
          const grade = academicService.calculateGrade(validNum, m.maxMarks);
          return {
            ...m,
            marksObtained: validNum,
            grade,
          };
        }
        return m;
      })
    );
    setIsSavedSuccessfully(false);
  };

  const handleSaveMarks = async () => {
    if (Object.keys(errors).length > 0) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please resolve invalid marks inputs before submitting.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await academicService.saveExamMarks(marks);
      setIsSavedSuccessfully(true);
      addToast({
        type: 'success',
        title: 'Marks Committed to Ledger',
        message: `Saved examination grades for ${marks.length} candidates in ${selectedSubject}.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Examination Marks Entry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inline grades grading matrix, automatic grade assessment, and ledger validation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSavedSuccessfully && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Marks Locked</span>
            </span>
          )}

          <button
            onClick={handleSaveMarks}
            disabled={isSaving || Object.keys(errors).length > 0}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Committing...' : 'Commit Examination Marks'}</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Examination
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="Mid-Term 1">Mid-Term 1 (Internal Assessment)</option>
              <option value="Mid-Term 2">Mid-Term 2 (Internal Assessment)</option>
              <option value="Semester Final">Semester End Theory Examination</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Class Section
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="cls_csea">CSE - 3rd Year (Sec A)</option>
              <option value="cls_cseb">CSE - 3rd Year (Sec B)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Course / Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="Data Structures & Algorithms">Data Structures & Algorithms (CS301)</option>
              <option value="Database Management Systems">Database Management Systems (CS302)</option>
              <option value="Java Programming">Java Programming (CS303)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Marks Editable Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3 w-40">Marks Obtained</th>
                <th className="px-5 py-3 text-center">Max Marks</th>
                <th className="px-5 py-3 text-center">Percentage</th>
                <th className="px-5 py-3 text-center">Calculated Grade</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {marks.map((row) => {
                const hasErr = !!errors[row.id];
                const pct = Math.round((row.marksObtained / row.maxMarks) * 100);

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-slate-900 tabular-nums">
                      {row.studentRollNo}
                    </td>

                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {row.studentName}
                    </td>

                    {/* Inline Editable Marks */}
                    <td className="px-5 py-3">
                      <div className="relative">
                        <input
                          type="number"
                          value={row.marksObtained}
                          onChange={(e) => handleMarkChange(row.id, e.target.value)}
                          min="0"
                          max={row.maxMarks}
                          className={`w-24 px-3 py-1.5 font-mono font-bold text-sm text-slate-900 border rounded-lg focus:outline-hidden ${
                            hasErr
                              ? 'border-rose-500 bg-rose-50/50 text-rose-700'
                              : 'border-slate-300 focus:border-blue-500 bg-white'
                          }`}
                        />
                        {hasErr && (
                          <div className="text-[10px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors[row.id]}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-center font-mono text-slate-500">
                      {row.maxMarks}
                    </td>

                    <td className="px-5 py-3 text-center font-mono font-bold text-slate-800">
                      {pct}%
                    </td>

                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block w-8 py-0.5 text-center font-mono font-bold rounded text-xs ${
                          row.grade === 'O' || row.grade === 'A+'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : row.grade === 'A' || row.grade === 'B+'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {row.grade}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-slate-500 text-[11px]">
                      {row.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
