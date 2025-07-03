import React, { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const ProfileHeader = ({ authorized, stats, username, name, bio, age, setEditProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });

  const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : '';
  const sessionUser = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : '';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        // Check follow status
        if (!authorized && token && username !== sessionUser) {
          const statusRes = await fetch(`${apiBaseUrl}/follow/status/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!statusRes.ok) throw new Error('Follow status fetch failed');
          const statusData = await statusRes.json();
          setIsFollowing(statusData.isFollowing);
        }

        // Get follower/following counts
        const countsRes = await fetch(`${apiBaseUrl}/follow/counts/${username}`);
        if (!countsRes.ok) throw new Error('Follow counts fetch failed');
        const countsData = await countsRes.json();

        setFollowCounts({
          followers: countsData.followerCount ?? 0,
          following: countsData.followingCount ?? 0
        });

      } catch (error) {
        console.error('Error fetching follow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [username, authorized, token, sessionUser, apiBaseUrl]);

  const handleFollowToggle = async () => {
    if (!token) return;

    const method = isFollowing ? 'DELETE' : 'POST';
    const url = isFollowing
      ? `${apiBaseUrl}/follow/unfollow/${username}`
      : `${apiBaseUrl}/follow/${username}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Follow/unfollow failed');
      setIsFollowing(!isFollowing);

      // Refresh follow counts
      const countsRes = await fetch(`${apiBaseUrl}/follow/counts/${username}`);
      if (!countsRes.ok) throw new Error('Follow counts fetch failed');
      const countsData = await countsRes.json();

      setFollowCounts({
        followers: countsData.followerCount ?? 0,
        following: countsData.followingCount ?? 0
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row md:justify-between items-center py-4'>
      <div className='flex items-center space-x-4'>
        <FaUserCircle className='text-gray-400' size={100} />

        <div className='flex flex-col'>
          <div className='flex items-center space-x-2'>
            <div className='text-white text-2xl font-bold'>{username}</div>

            {!authorized && !loading && (
              <button
                onClick={handleFollowToggle}
                className={`uppercase font-semibold px-3 ${isFollowing ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'} text-white rounded text-sm`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          {name && <div className='text-white'>{name}</div>}
          {bio && <div className='text-gray-300 text-sm'>{bio}</div>}
          {age && <div className='text-gray-300 text-sm'>Age {age}</div>}

          {authorized && (
            <button
              onClick={() => setEditProfile(true)}
              className='uppercase font-semibold px-3 bg-gray-400 hover:bg-gray-300 text-white rounded-md text-sm w-fit mt-2'
            >
              Edit/Delete profile
            </button>
          )}
        </div>
      </div>

      <div className='flex mt-4 md:mt-0'>
        <Link to={`/${username}/network`} className='flex flex-col justify-center h-fit border-r border-r-gray-500 text-center px-2 group'>
          <div className='font-bold text-2xl text-white'>{followCounts.followers}</div>
          <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>Followers</div>
        </Link>
        <Link to={`/${username}/network`} className='flex flex-col justify-center h-fit border-r border-r-gray-500 text-center px-2 group'>
          <div className='font-bold text-2xl text-white'>{followCounts.following}</div>
          <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>Following</div>
        </Link>
        <Link to={`/${username}/watched`} className='flex flex-col justify-center h-fit border-r border-r-gray-500 text-center px-2 group'>
          <div className='font-bold text-2xl text-white'>{stats.watched}</div>
          <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>Watched</div>
        </Link>
        <Link to={`/${username}/diary`} className='flex flex-col justify-center h-fit border-r border-r-gray-500 text-center px-2 group'>
          <div className='font-bold text-2xl text-white'>{stats.this_year}</div>
          <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>This year</div>
        </Link>
        <Link to={`/${username}/lists`} className='flex flex-col justify-center h-fit text-center px-2 group'>
          <div className='font-bold text-2xl text-white'>{stats.lists}</div>
          <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>Lists</div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;

