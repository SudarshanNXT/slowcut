import React, { useEffect, useState, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { 
  IoHeartOutline, 
  IoHeartSharp,
  IoChatbubbleOutline, 
  IoPersonAddOutline,
  IoDocumentTextOutline,
  IoCheckmarkDoneOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoTimeOutline,
  IoNotificationsOutline
} from "react-icons/io5";

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({ markAll: false, clear: false });
  const { userData } = useContext(AuthContext);

  const API = import.meta.env.VITE_API_BASE_URL;
  const token = userData?.token;

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      const res = await fetch(`${API}/activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("🔍 Response status:", res.status);
      console.log("🔍 Response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("🚀 Activity Data:", data);
      console.log("🚀 Data length:", data?.length);
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activity feed:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllSeen = async () => {
    try {
      setActionLoading(prev => ({ ...prev, markAll: true }));
      await fetch(`${API}/activity/seen`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchActivities();
    } catch (error) {
      console.error("Failed to mark as seen:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, markAll: false }));
    }
  };

  const handleClearAll = async () => {
    try {
      setActionLoading(prev => ({ ...prev, clear: true }));
      await fetch(`${API}/activity`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivities([]);
    } catch (error) {
      console.error("Failed to clear activities:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, clear: false }));
    }
  };

  const getActivityIcon = (type) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    switch (type) {
      case "FOLLOW":
        return <IoPersonAddOutline className={`${iconClass} text-gray-400`} />;
      case "LIST_LIKE":
        return <IoHeartSharp className={`${iconClass} text-gray-400`} />;
      case "LIST_COMMENT":
        return <IoChatbubbleOutline className={`${iconClass} text-gray-400`} />;
      case "REVIEW_LIKE":
        return <IoHeartSharp className={`${iconClass} text-gray-400`} />;
      case "REVIEW_COMMENT":
        return <IoChatbubbleOutline className={`${iconClass} text-gray-400`} />;
      case "NEW_REVIEW":
        return <IoDocumentTextOutline className={`${iconClass} text-gray-400`} />;
      default:
        return <IoNotificationsOutline className={`${iconClass} text-gray-400`} />;
    }
  };

  const renderText = (activity) => {
    const actor = activity.triggered_by?.username || "Someone";
    const actorName = activity.triggered_by?.profile?.name || actor;

    switch (activity.type) {
      case "FOLLOW":
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> started following you
            </span>
            <span className="text-xs text-gray-500 mt-1">Welcome your new follower!</span>
          </div>
        );
      case "LIST_LIKE":
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> liked your{" "}
              <Link 
                to={`/list/${activity.target_id}`} 
                className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                list
              </Link>
            </span>
            <span className="text-xs text-gray-500 mt-1">Your content is appreciated!</span>
          </div>
        );
      case "LIST_COMMENT":
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> commented on your{" "}
              <Link 
                to={`/list/${activity.target_id}`} 
                className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                list
              </Link>
            </span>
            <span className="text-xs text-gray-500 mt-1">Join the conversation!</span>
          </div>
        );
      case "REVIEW_LIKE":
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> liked your{" "}
              <Link 
                to={`/review/${activity.target_id}`} 
                className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                review
              </Link>
            </span>
            <span className="text-xs text-gray-500 mt-1">Great review!</span>
          </div>
        );
      case "REVIEW_COMMENT":
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> commented on your{" "}
              <Link 
                to={`/review/${activity.target_id}`} 
                className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                review
              </Link>
            </span>
            <span className="text-xs text-gray-500 mt-1">Check out their thoughts!</span>
          </div>
        );
      case "NEW_REVIEW":
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> posted a new{" "}
              <Link 
                to={`/review/${activity.target_id}`} 
                className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                review
              </Link>
            </span>
            <span className="text-xs text-gray-500 mt-1">Fresh content to explore!</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col">
            <span className="text-white">
              <Link 
                to={`/${actor}`} 
                className="font-semibold text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {actorName}
              </Link> interacted with your content
            </span>
          </div>
        );
    }
  };

  const unreadCount = activities.filter(activity => !activity.seen).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-600 rounded flex-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <IoNotificationsOutline className="w-7 h-7 text-gray-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
              <p className="text-gray-400 text-sm">
                {unreadCount > 0 ? (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                    <span>{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</span>
                  </span>
                ) : (
                  "You're all caught up!"
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchActivities}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <IoRefreshOutline className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            {activities.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllSeen}
                  disabled={actionLoading.markAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <IoCheckmarkDoneOutline className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {actionLoading.markAll ? 'Marking...' : 'Mark All Read'}
                  </span>
                </button>
                
                <button
                  onClick={handleClearAll}
                  disabled={actionLoading.clear}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <IoTrashOutline className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {actionLoading.clear ? 'Clearing...' : 'Clear All'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <IoNotificationsOutline className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Recent Activity</h3>
            <p className="text-gray-500">When people interact with your content, you'll see it here.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                !activity.seen 
                  ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600 shadow-md" 
                  : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
              }`}
            >
              {!activity.seen && (
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-500 to-gray-600"></div>
              )}
              
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {renderText(activity)}
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center space-x-2 text-xs text-gray-500">
                    <IoTimeOutline className="w-3 h-3" />
                    <span className="whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              {!activity.seen && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/5 to-transparent animate-pulse"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {activities.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Showing {activities.length} notification{activities.length !== 1 ? 's' : ''} • 
            {unreadCount > 0 ? ` ${unreadCount} unread` : ' All caught up'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;