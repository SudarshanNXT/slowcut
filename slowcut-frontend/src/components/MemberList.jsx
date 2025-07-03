import React from 'react';
import MemberCard from '../components/cards/MemberCard';

const MemberList = ({ members, onMemberClick }) => {
  return (
    <div className="space-y-2">
      {members.map((member) => (
        <MemberCard 
          key={member.username} 
          member={member} 
          onClick={() => onMemberClick(member.username)}
        />
      ))}
    </div>
  );
};

export default MemberList;