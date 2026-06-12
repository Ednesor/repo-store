import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute() {
    // Leemos del store si está logueado
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    // Si no está logueado, lo pateamos a la pantalla de login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // Si está todo bien, Outlet renderiza el componente hijo
    return <Outlet />;
}
