import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { AttendanceSession, AttendanceRecord, User } from '../../types';
import { schoolStore } from '../../services/store';
import { X, RefreshCw, Clock, CheckCircle2, AlertTriangle, ShieldCheck, QrCode, UserCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  session: AttendanceSession | null;
  records: AttendanceRecord[];
  activeUser: User | null;
  onAttendanceRecorded: () => void;
}

export const DynamicQRSessionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  session,
  records,
  activeUser,
  onAttendanceRecorded
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);
  const [scanAction, setScanAction] = useState<'sign_in' | 'sign_out'>('sign_in');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Generate QR code image whenever token changes
  useEffect(() => {
    if (!session || !session.currentToken) return;

    QRCode.toDataURL(session.currentToken.token, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [session, session?.currentToken?.token]);

  // Dynamic 2-minute countdown timer
  useEffect(() => {
    if (!isOpen || !session || !session.currentToken) return;

    const updateTimer = () => {
      const now = Date.now();
      const expiresAt = session.currentToken.expiresAt;
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setSecondsRemaining(diff);

      // Auto refresh if expired
      if (diff <= 0) {
        schoolStore.refreshSessionToken(session.id);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen, session, session?.currentToken?.expiresAt]);

  if (!isOpen || !session) return null;

  const sessionRecords = records.filter((r) => r.sessionId === session.id);
  const currentToken = session.currentToken;

  const handleSimulateScan = (actionToRecord: 'sign_in' | 'sign_out') => {
    if (!currentToken) return;

    const result = schoolStore.recordStaffAttendance(currentToken.token, actionToRecord);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      onAttendanceRecorded();
    } else {
      setMessage({ text: result.message, type: 'error' });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const handleForceTokenRefresh = () => {
    schoolStore.refreshSessionToken(session.id);
    setMessage({ text: 'Dynamic QR token refreshed immediately.', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-900">
                Live Attendance Engine
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">2-Minute Dynamic QR</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
              {session.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {message && (
            <div
              className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Central QR Display & 2-Minute Security Countdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Dynamic Short-lived Attendance QR"
                    className="w-52 h-52 object-contain"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">
                    Generating dynamic token...
                  </div>
                )}
              </div>

              {/* Progress & Countdown Bar */}
              <div className="w-full mt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    QR Validity:
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {Math.floor(secondsRemaining / 60)}:
                    {(secondsRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(secondsRemaining / 120) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleForceTokenRefresh}
                  className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Token Now</span>
                </button>
              </div>
            </div>

            {/* Verification and Info Side */}
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs text-blue-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Server-Validated Dynamic Security</span>
                </div>
                <p className="text-blue-900/90 leading-relaxed">
                  Photographed or forwarded codes expire after 2 minutes. The official attendance timestamp is generated strictly on the server—client clocks are not trusted.
                </p>
                <div className="font-mono text-[11px] text-blue-800 pt-1">
                  Token: {currentToken?.token}
                </div>
              </div>

              {/* Direct Scan Actions for Currently Authenticated Staff */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Staff Verification Action
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Recording for: <strong className="text-slate-900">{activeUser?.name}</strong> ({activeUser?.role})
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulateScan('sign_in')}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Record Sign In</span>
                  </button>

                  <button
                    onClick={() => handleSimulateScan('sign_out')}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Record Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Attendance Audit Records for this Session */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Verified Session Records ({sessionRecords.length})
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Official Server Clock: {new Date().toLocaleDateString()}
              </span>
            </div>

            {sessionRecords.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
                No attendance scans recorded for this session yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Staff Member</th>
                      <th className="py-2.5 px-3 font-semibold">Action</th>
                      <th className="py-2.5 px-3 font-semibold">Server Timestamp</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessionRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-900">{rec.userName}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-semibold uppercase text-[10px] tracking-wider ${
                              rec.action === 'sign_in' ? 'text-emerald-700' : 'text-slate-700'
                            }`}
                          >
                            {rec.action === 'sign_in' ? 'Sign In' : 'Sign Out'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums">
                          {new Date(rec.serverTimestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
