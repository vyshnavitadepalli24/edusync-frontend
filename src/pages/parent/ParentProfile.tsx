import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, ShieldCheck, Save, Bell } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ParentProfile: React.FC = () => {
  const { addToast } = useToast();

  const [parentName, setParentName] = useState('Suresh Kumar');
  const [phone, setPhone] = useState('+91 98403 45678');
  const [email, setEmail] = useState('suresh.kumar@gmail.com');
  const [emergencyContact, setEmergencyContact] = useState('+91 98403 99999 (Radha Kumar - Mother)');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [anDropAlerts, setAnDropAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Guardian contact records & communication channels saved.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Guardian & Ward Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified guardian records, emergency contact chain, and automated session-skip SMS alerts
        </p>
      </div>

      {/* Ward Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
          Enrolled Ward Particulars
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Student Name</span>
            <div className="font-bold text-slate-900 mt-0.5">Rahul Kumar</div>
            <div className="text-slate-500 font-mono mt-0.5">Roll: 21CS001</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Department & Section</span>
            <div className="font-bold text-slate-900 mt-0.5">CSE - 3rd Year (Sec A)</div>
            <div className="text-slate-500 mt-0.5">Room CS-Lab 304</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Class Mentor</span>
            <div className="font-bold text-slate-900 mt-0.5">Prof. Anitha Vasudevan</div>
            <div className="text-slate-500 mt-0.5">Senior Assistant Professor</div>
          </div>
        </div>
      </div>

      {/* Guardian Editable Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
            Primary Guardian Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Guardian Full Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Mobile Phone (Primary SMS)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address (Reports & Transcripts)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Secondary / Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
            Automated Advisory Preferences
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={anDropAlerts}
                onChange={(e) => setAnDropAlerts(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Real-time SMS Alert when Rahul is marked Present in Forenoon but Absent in Afternoon</span>
            </label>

            <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>SMS Alert when attendance rate falls below the statutory 75% limit</span>
            </label>

            <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Monthly AI Cognitive Progress Summary delivered to email inbox</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Guardian Information</span>
          </button>
        </div>
      </form>
    </div>
  );
};
