import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const isAuthenticated = localStorage.getItem('userInfo'); 

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireAuth