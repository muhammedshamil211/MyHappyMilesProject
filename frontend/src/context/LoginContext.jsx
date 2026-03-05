import { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({children})=>{

    const [login,setLogin] = useState(false);
    const [user,setUser] = useState(null);
    const [signUp,setSignUp] = useState(false);

    return (
    <LoginContext.Provider value={{ login, setLogin , user, setUser ,signUp,setSignUp}}>
      {children}
    </LoginContext.Provider>
  );
}