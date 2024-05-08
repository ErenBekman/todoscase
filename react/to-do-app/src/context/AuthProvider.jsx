import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext({});
import axios from '../api/axios';


export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || "");
    const navigate = useNavigate();

    const loginAction = async ({ email, password }) => {
        try {
            const response = await axios.post("/auth/login", { email, password });
            const { data } = response;
            if (data) {
                setToken(data.access_token);
                localStorage.setItem("access_token", data.access_token);
                navigate("/");
                loadUser();
                return;
            }
        } catch (err) {
          console.error(err);
          throw new Error(res.message);
        }
    };
    
    const loadUser = async () => {
        try {
          const response = await axios.get("/auth/me", 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          );
          const { data } = response;
          if (data) {
            setUser(data);
            console.log('data :>> ', data);
            localStorage.setItem("user", data);
            return;
          }
          
        } catch (err) {
          console.error(err);
          throw new Error(res.message);
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("access_token");
        navigate("/login");
    };
    
    return (
        <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

