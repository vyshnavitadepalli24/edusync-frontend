import React, { useState, useEffect } from 'react';
import {
  UserSquare2,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Eye,
  GraduationCap,
  Send,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Parent } from '../../types';
import { StatusBadge } from '../../components/common/Badges';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const PrincipalParents: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { addToast } = useToast();

  const [parents, setParents] = useState<Parent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [contactParent, setContactParent] = useState<Parent | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    academicService.getParents().then(setParents);
  }, []);

  const filteredParents = parents.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchStudent = p.studentName.toLowerCase().includes(q);
      const matchRoll = p.studentRollNo.toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      if (!matchName && !matchStudent && !matchRoll && !matchPhone) return false;
    }
    return true;
  });

  const handleSendMessage = () => {
    if (!contactParent || !messageText.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      addToast({
        type: 'success',
        title: 'SMS & Email Dispatched',
        message: `Official institutional notification delivered to ${contactParent.name} (${contactParent.phone}).`,
      });
      setIsSending(false);
      setContactParent(null);
      setMessageText('');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Guardian Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified parent contacts, child academic link and automated SMS/Email advisory dispatch
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg self-start sm:self-auto font-semibold">
          {parents.length} Enrolled Guardians
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredParents.length} parents
        </span>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by parent name, child name or mobile..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Guardian Name</th>
                <th className="px-5 py-3">Linked Ward</th>
                <th className="px-5 py-3">Contact Email</th>
                <th className="px-5 py-3">Phone Number</th>
                <th className="px-5 py-3">Portal Link Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
              {filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No parents found matching the search query.
                  </td>
                </tr>
              ) : (
                filteredParents.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.occupation}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{p.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {p.studentRollNo} · {p.studentClass}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-600 truncate max-w-xs">
                      {p.email}
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {p.phone}
                    </td>

                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setContactParent(p)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Contact</span>
                        </button>
                        <button
                          onClick={() => setSelectedParent(p)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Parent Modal */}
      {selectedParent && (
        <Modal
          isOpen={!!selectedParent}
          onClose={() => setSelectedParent(null)}
          title={`Guardian Profile: ${selectedParent.name}`}
          subtitle={`Ward: ${selectedParent.studentName} (${selectedParent.studentRollNo})`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold">Mobile</span>
                  <div className="font-mono text-slate-800 font-bold mt-0.5">{selectedParent.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold">Email</span>
                  <div className="font-mono text-slate-800 font-bold mt-0.5">{selectedParent.email}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Residential Address</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{selectedParent.address}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedParent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Contact Parent Modal */}
      {contactParent && (
        <Modal
          isOpen={!!contactParent}
          onClose={() => setContactParent(null)}
          title={`Dispatch Official Communication to ${contactParent.name}`}
          subtitle={`Ward: ${contactParent.studentName} (${contactParent.studentRollNo})`}
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Communication Message (SMS & Email):</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="e.g. Dear Parent, please review Rahul's attendance for the afternoon session on Sep 27. An AI session-skip flag was registered."
                rows={4}
                className="w-full p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setContactParent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSending || !messageText.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Transmitting...' : 'Dispatch Message'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
