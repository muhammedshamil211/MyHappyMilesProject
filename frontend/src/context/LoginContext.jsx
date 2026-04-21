import { createContext, useState, useEffect } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {

    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [signUp, setSignUp] = useState(false);
    const [initializing, setInitializing] = useState(true);

    // Silent Refresh Token attempt on mount
    useEffect(() => {
        const attemptRefresh = async () => {
            const existingToken = localStorage.getItem('token');
            const existingUser = localStorage.getItem('user');
            try {
                if (!existingToken || !existingUser) {
                    setInitializing(false);
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`, {
                    method: "POST",
                    credentials: "include"
                });

                const data = await res.json();
                if (data.success) {
                    localStorage.setItem("token", data.data.token);
                    localStorage.setItem("user", JSON.stringify(data.data.user));
                    setUser(data.data.user);
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            } catch (err) {
                console.error("Silent refresh failed");
            } finally {
                setInitializing(false);
            }
        };

        attemptRefresh();
    }, []);

    // Sync localStorage updates globally
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <LoginContext.Provider value={{ login, setLogin, user, setUser, signUp, setSignUp, initializing }}>
            {children}
        </LoginContext.Provider>
    );
}