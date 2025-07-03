// MemberCard.jsx
import React from 'react';
import { FaUserCircle, FaEye, FaThLarge, FaHeart } from 'react-icons/fa';

const MemberCard = ({ member, onClick }) => {
  const memberData = member || {};

  return (
    <div 
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-800 transition-colors duration-200 p-4 rounded-lg"
    >
      <div className="flex items-center justify-between">
        {/* Avatar & Info */}
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-gray-400 text-4xl hover:text-blue-400" />
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="text-lg font-semibold text-white">
                {memberData.username || 'Unknown User'}
              </h3>
              {memberData.verified && (
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-sm text-gray-400">
              {(memberData.name || memberData.username) + ' • '}
              {(memberData.reviewed || 0).toLocaleString()} reviews
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {memberData.followerCount ?? 0} followers • {memberData.followingCount ?? 0} following
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-6 text-sm">
          <div className="flex items-center text-green-400">
            <FaEye className="mr-1" />
            <span>{(memberData.watched || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center text-blue-400">
            <FaThLarge className="mr-1" />
            <span>{(memberData.lists || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center text-orange-400">
            <FaHeart className="mr-1" />
            <span>{(memberData.reviewed || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;