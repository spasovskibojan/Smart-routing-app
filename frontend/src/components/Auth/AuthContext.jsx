import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { me, getAccessToken, clearTokens } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    // Check if we have a stored JWT token
    const token = getAccessToken();

    if (token) {
      try {
        const res = await me();
        if (res.ok) {
          const data = await res.json();
          setUser(data.username);
        } else {
          // Token invalid or expired
          clearTokens();
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        clearTokens();
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading Smart Routing App...</h5>
            <p className="text-muted small">
              Please wait while we authenticate you
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
