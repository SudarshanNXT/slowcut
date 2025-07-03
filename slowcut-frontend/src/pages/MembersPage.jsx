import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import MemberList from '../components/MemberList';
import { FaSearch } from 'react-icons/fa';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const sortOptions = [
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Followers (High to Low)', value: 'followers-desc' },
  { label: 'Followers (Low to High)', value: 'followers-asc' },
  { label: 'Reviews (High to Low)', value: 'reviews-desc' },
  { label: 'Reviews (Low to High)', value: 'reviews-asc' },
  { label: 'Watched (High to Low)', value: 'watched-desc' },
  { label: 'Watched (Low to High)', value: 'watched-asc' },
  { label: 'Lists (High to Low)', value: 'lists-desc' },
  { label: 'Lists (Low to High)', value: 'lists-asc' },
];

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('followers-desc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchMembersWithCounts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/search/member/stats`);
        if (!response.ok) throw new Error('Failed to fetch members');

        const membersData = await response.json();
        const membersWithCounts = await Promise.all(
          (membersData.results || []).map(async (member) => {
            try {
              const countsRes = await fetch(`${apiBaseUrl}/follow/counts/${member.username}`);
              if (!countsRes.ok) throw new Error();
              const counts = await countsRes.json();
              return { ...member, ...counts };
            } catch {
              return { ...member, followerCount: 0, followingCount: 0 };
            }
          })
        );

        setMembers(membersWithCounts);
        setFilteredMembers(membersWithCounts);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
        setFilteredMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersWithCounts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    const filtered = members.filter((member) =>
      (member.username?.toLowerCase().includes(query)) ||
      (member.name?.toLowerCase().includes(query))
    );

    setFilteredMembers(sortMembers(filtered, sort));
  };

  const sortMembers = (list, sortKey) => {
    return [...list].sort((a, b) => {
      switch (sortKey) {
        case 'name-asc':
          return a.username.localeCompare(b.username);
        case 'name-desc':
          return b.username.localeCompare(a.username);
        case 'followers-desc':
          return (b.followerCount || 0) - (a.followerCount || 0);
        case 'followers-asc':
          return (a.followerCount || 0) - (b.followerCount || 0);
        case 'reviews-desc':
          return (b.reviewed || 0) - (a.reviewed || 0);
        case 'reviews-asc':
          return (a.reviewed || 0) - (b.reviewed || 0);
        case 'watched-desc':
          return (b.watched || 0) - (a.watched || 0);
        case 'watched-asc':
          return (a.watched || 0) - (b.watched || 0);
        case 'lists-desc':
          return (b.lists || 0) - (a.lists || 0);
        case 'lists-asc':
          return (a.lists || 0) - (b.lists || 0);
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (e) => {
    const selected = e.target.value;
    setSort(selected);
    setFilteredMembers(sortMembers(filteredMembers, selected));
  };

  const handleMemberClick = (username) => {
    if (isLoggedIn) {
      navigate(`/${username}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Members</h1>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative max-w-lg w-full mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="w-full md:w-80">
              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full py-2 px-4 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading members...</div>
        ) : filteredMembers.length > 0 ? (
          <MemberList members={filteredMembers} onMemberClick={handleMemberClick} />
        ) : (
          <div className="text-center py-8 text-gray-400">
            {search ? 'No matching members found' : 'No members available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
