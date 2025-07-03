import React, { useState, useContext, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfileForm = ({ editProfile, setEditProfile, username }) => {
    const [formData, setFormData] = useState({
        new_username: username,
        name: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    const token = userInfo?.token || '';
    const email = userInfo?.email || '';
    const { deleteProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    // Custom confirmation dialog
    const confirmDelete = () => {
        return toast.info(
            <div className="text-white">
                <p className="font-bold mb-2">Delete Account?</p>
                <p className="text-sm mb-4">This action cannot be undone.</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => {
                            toast.dismiss();
                            handleProfileDelete();
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: "bg-gray-800"
            }
        );
    };

    // Fetch profile data when component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_profile_data/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        new_username: username,
                        name: data.profile?.name || '',
                        bio: data.profile?.bio || ''
                    });
                    toast.dismiss();
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch profile data');
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username, token, apiBaseUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    new_username: formData.new_username,
                    name: formData.name,
                    bio: formData.bio,
                    email: email
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                toast.success('Profile updated successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setEditProfile(false);
                navigate(`/${data.new_username || username}`);
                window.location.reload();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${apiBaseUrl}/users/delete_profile`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success('Account deleted successfully', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    deleteProfile();
                    setEditProfile(false);
                    navigate('/');
                }, 1500);
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className={`fixed inset-0 h-full w-full flex items-center justify-center bg-black bg-opacity-80 z-50`}>
                <div className="text-white">Loading profile data...</div>
                <ToastContainer />
            </div>
        );
    }

    return (
        <>
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            
            <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${editProfile ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
                <div className={`flex flex-col mx-4 md:mx-0 w-full md:w-[500px] bg-black rounded-md relative ${editProfile ? '' : 'scale-50'} transition-all duration-200 border border-gray-700`}>
                    <div className='flex items-center justify-between border-b border-b-gray-700 p-4'>
                        <div className='text-white text-xl font-bold'>Edit Profile</div>
                        <button 
                            onClick={() => setEditProfile(false)} 
                            className='text-xl text-gray-400 hover:text-white transition-colors'
                            disabled={loading}
                        >
                            <IoMdClose size={24}/>
                        </button>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="p-4">
                        <div className='space-y-4'>
                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="new_username" className='text-sm text-gray-300'>Username</label>
                                <input
                                    type="text"
                                    name="new_username"
                                    value={formData.new_username}
                                    onChange={handleChange}
                                    className='rounded-md p-3 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="name" className='text-sm text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='rounded-md p-3 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    disabled={loading}
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="email" className='text-sm text-gray-300'>Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={email}
                                    className='rounded-md p-3 w-full bg-gray-600 text-gray-400 cursor-not-allowed'
                                    disabled
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="bio" className='text-sm text-gray-300'>Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className='rounded-md p-3 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24'
                                    maxLength="200"
                                    disabled={loading}
                                />
                                <div className="text-xs text-gray-500 text-right">
                                    {formData.bio.length}/200 characters
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-between mt-6'>
                            <button 
                                type="button" 
                                onClick={confirmDelete} 
                                className='flex items-center bg-red-600 hover:bg-red-500 font-medium px-4 py-2.5 rounded-md text-white transition-colors disabled:opacity-50'
                                disabled={loading || isDeleting}
                            >
                                <FaTrashAlt className='mr-2'/> 
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                            <div className='space-x-2'>
                                <button 
                                    type="button" 
                                    onClick={() => setEditProfile(false)} 
                                    className='bg-gray-600 hover:bg-gray-500 font-medium px-4 py-2.5 rounded-md text-white transition-colors disabled:opacity-50'
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type='submit' 
                                    className='bg-green-600 hover:bg-green-500 font-medium px-4 py-2.5 rounded-md text-white transition-colors disabled:opacity-50'
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfileForm;