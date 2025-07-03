import React, { useState, useEffect } from "react";
import { FaEye, FaThLarge, FaHeart, FaUserCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading.jsx";

const Network = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("followers");
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ followerCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const session = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
  const token = session?.token;
  const sessionUsername = session?.username;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/follow/counts/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [username, token]);

  useEffect(() => {
    const fetchUsersWithStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/follow/list/${username}/${activeTab}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user list");
        const data = await response.json();

        const enrichedUsers = await Promise.all(
          data.result.map(async (user) => {
            if (user.username === sessionUsername) {
              return { ...user, isFollowing: false, followerCount: 0, followingCount: 0 };
            }

            try {
              const statusRes = await fetch(`${apiBaseUrl}/follow/status/${user.username}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              const statusData = await statusRes.json();

              const countsRes = await fetch(`${apiBaseUrl}/follow/counts/${user.username}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const counts = await countsRes.json();

              return {
                ...user,
                isFollowing: statusData.isFollowing,
                followerCount: counts.followerCount || 0,
                followingCount: counts.followingCount || 0,
              };
            } catch (err) {
              console.error(`Error for ${user.username}:`, err);
              return {
                ...user,
                isFollowing: false,
                followerCount: 0,
                followingCount: 0,
              };
            }
          })
        );

        setUsers(enrichedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithStatus();
  }, [username, activeTab, token, sessionUsername]);

  const handleToggleFollow = async (targetUsername, isCurrentlyFollowing) => {
    try {
      const method = isCurrentlyFollowing ? "DELETE" : "POST";
      const endpoint = isCurrentlyFollowing
        ? `${apiBaseUrl}/follow/unfollow/${targetUsername}`
        : `${apiBaseUrl}/follow/${targetUsername}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update follow status");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === targetUsername
            ? { ...user, isFollowing: !isCurrentlyFollowing }
            : user
        )
      );

      const updatedCounts = await fetch(`${apiBaseUrl}/follow/counts/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const countData = await updatedCounts.json();
      setCounts(countData);
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  if (loading) {
    return (
      <div className="z-10 absolute top-[65px] w-full h-5/6">
        <div className="container mx-auto flex items-center justify-center h-full">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:px-8 max-w-4xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab("followers")}
          className={`font-bold text-lg px-4 py-2 rounded-t-lg ${
            activeTab === "followers"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Followers ({counts.followerCount || 0})
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`font-bold text-lg px-4 py-2 rounded-t-lg ${
            activeTab === "following"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Following ({counts.followingCount || 0})
        </button>
      </div>

      <div className="text-xs text-gray-400 uppercase grid grid-cols-5 gap-4 px-4 mb-2">
        <span className="col-span-2">Name</span>
        <span className="text-center">Watched</span>
        <span className="text-center">Lists</span>
        <span className="text-center">Reviews</span>
      </div>

      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={index}
              onClick={() => navigate(`/${user.username}`)}
              className="flex items-center justify-between border-b border-gray-700 pb-3 px-4 cursor-pointer hover:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-4 col-span-2 w-2/5">
                <FaUserCircle className="text-gray-500" size={40} />
                <div>
                  <div className="font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-gray-400">
                    {user.name || user.username} • {user.reviewed || 0} reviews
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.followerCount || 0} followers • {user.followingCount || 0} following
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center w-1/5">
                <FaEye className="text-green-500 mr-1" />
                <span>{user.watched || 0}</span>
              </div>

              <div className="flex items-center justify-center w-1/5">
                <FaThLarge className="text-blue-500 mr-1" />
                <span>{user.lists || 0}</span>
              </div>

              <div className="flex items-center justify-center w-1/5">
                <FaHeart className="text-orange-500 mr-1" />
                <span>{user.reviewed || 0}</span>
              </div>

              <div className="pl-2">
                {user.username !== sessionUsername && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFollow(user.username, user.isFollowing);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      user.isFollowing
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">No {activeTab} found</div>
        )}
      </div>
    </div>
  );
};

export default Network;