import { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from '../../config';
import { authHeaders, getAccessToken } from '../Auth/api';
import { useAuth } from '../Auth/AuthContext';

const SavedRoutesContext = createContext();

export function SavedRoutesProvider({ children }) {
  const { user } = useAuth();
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedRoutes = async () => {
    // Only fetch if user is authenticated
    const token = getAccessToken();
    if (!token) {
      setSavedRoutes([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers = authHeaders();
      console.log('Fetching saved routes with headers:', headers);

      const response = await fetch(`${API_BASE_URL}/api/saved-routes/`, {
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          setSavedRoutes([]);
          return;
        }
        throw new Error("Failed to fetch saved routes");
      }

      const data = await response.json();
      setSavedRoutes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRoute = async (routeData) => {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || "Failed to save route");
      }

      const newRoute = await response.json();
      setSavedRoutes(prev => [newRoute, ...prev]);
      return newRoute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = async (id, routeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/${id}/`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update route");
      }

      const updatedRoute = await response.json();
      setSavedRoutes(prev =>
        prev.map(route => route.id === id ? updatedRoute : route)
      );
      return updatedRoute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-routes/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete route");
      }

      setSavedRoutes(prev => prev.filter(route => route.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch routes when user changes (login/logout)
  useEffect(() => {
    if (user) {
      fetchSavedRoutes();
    } else {
      setSavedRoutes([]);
    }
  }, [user]);

  return (
    <SavedRoutesContext.Provider value={{
      savedRoutes,
      loading,
      error,
      fetchSavedRoutes,
      saveRoute,
      updateRoute,
      deleteRoute,
      clearError: () => setError(null)
    }}>
      {children}
    </SavedRoutesContext.Provider>
  );
}

export const useSavedRoutes = () => useContext(SavedRoutesContext);