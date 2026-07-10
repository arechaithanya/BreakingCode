import React from 'react';
import { UserPlus, User } from 'lucide-react';

const teammates = [
  { name: 'Alexandra Deff', role: 'Github Project Repository', status: 'Completed', statusColor: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { name: 'Edwin Adenike', role: 'Integrate User Auth System', status: 'In Progress', statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { name: 'Isaac Oluwatemilorun', role: 'Develop Search & Filter', status: 'Pending', statusColor: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  { name: 'David Oshodi', role: 'Responsive Layout for HP', status: 'In Progress', statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
];

const TeamCollaboration: React.FC = () => {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white font-bold">Team Collaboration</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] rounded-xl text-xs font-bold transition-all border border-[#00ff88]/20">
          <UserPlus size={14} />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {teammates.map((member, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none mb-1">{member.name}</h4>
                <p className="text-[10px] text-gray-500 leading-none">Working on <span className="text-gray-300">{member.role}</span></p>
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${member.statusColor}`}>
              {member.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCollaboration;
