import { useContext, useState } from 'react';
import toast from 'react-hot-toast';   
import Button from '../../component/user/components/ui/button/Button'
import Popup from '../../component/user/layout/Popup/Popup';
import CloseButton from '../../component/user/components/ui/closeButton/CloseButton';
import FormDiv from '../../component/user/layout/form/FormDiv'
import Input from '../../component/user/components/ui/inputArea/Input';
import style from './Loginpage.module.css'

import { GoogleLogin } from '@react-oauth/google';
import OTPModal from '../../component/auth/OTPModal';

import { LoginContext } from '../../context/LoginContext';
import { useLocation, useNavigate } from 'react-router-dom';
function Loginpage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login, setLogin, setUser, setSignUp } = useContext(LoginContext);
    const [authMode, setAuthMode] = useState('email'); // 'email' or 'mobile'
    const [identifier, setIdentifier] = useState(''); // Stores email or mobile
    const [password, setPassword] = useState('');
    
    // OTP State
    const [showOTP, setShowOTP] = useState(false);





    const processLoginData = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Login successful");
        setLogin(false);
        setShowOTP(false);

        if (data.user.role === 'admin') {
            navigate('/admin');
        } else if (data.user.role === 'user') {
            navigate(location.state?.from?.pathname || '/');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            const data = await res.json();
            if (data.success) {
                processLoginData(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Google Login Failed");
        }
    };

    const validation = async () => {
        if (!identifier) {
            toast.error('Identifier required');
            return;
        }

        if (authMode === 'mobile') {
            if (identifier.length < 10) return toast.error("Enter valid mobile number");
            // Request OTP
            try {
                const res = await fetch("http://localhost:5000/api/v1/auth/otp/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier, purpose: 'login' })
                });
                const data = await res.json();
                if (data.success) {
                    toast.success(data.message);
                    setShowOTP(true); // Open modal
                } else {
                    toast.error(data.message);
                }
            } catch (err) { toast.error("Error sending OTP"); }
            return;
        }

        // Email / Password Fallback
        if (!identifier.includes("@") || !identifier.includes(".")) {
            toast.error("Enter valid email");
            return;
        }
        if (!password) { 
            toast.error("Password required"); return; 
        }

        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: identifier, password: password })
            });
            const data = await res.json();
            if (data.success) {
                processLoginData(data.data);
            } else {
                toast.error(data.message || "Login failed!");
            }
        } catch (error) {
            toast.error("Server error");
        }
    }



    return (
        <>{login && !showOTP && (
            <Popup onClick={() => setLogin(false)}>

                <FormDiv padd={20}>
                    <CloseButton onClick={() => setLogin(false)} />
                    <p className={style.head}>Login</p>

                    <div className={style.authToggle}>
                        <button 
                            className={`${style.authToggleBtn} ${authMode === 'email' ? style.authToggleBtnActive : ''}`}
                            onClick={() => setAuthMode('email')}
                        >Email</button>
                        <button 
                            className={`${style.authToggleBtn} ${authMode === 'mobile' ? style.authToggleBtnActive : ''}`}
                            onClick={() => setAuthMode('mobile')}
                        >Mobile</button>
                    </div>

                    <Input
                        type={authMode === 'mobile' ? 'tel' : 'email'}
                        placeholder={authMode === 'mobile' ? 'Enter mobile number' : 'Enter your email'}
                        onChange={(e) => setIdentifier(e.target.value.trim())}
                    />

                    {authMode === 'email' && (
                        <Input
                            type='password'
                            placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}

                    <Button text={authMode === 'mobile' ? "Send OTP" : "Login"} onClick={validation} />
                    
                    <hr className={style.divider} />

                    <div className={style.googleContainer}>
                        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                            <GoogleLogin 
                                onSuccess={handleGoogleSuccess} 
                                onError={() => toast.error('Google Sign In Failed')} 
                            />
                        ) : (
                            <p className={style.googleDisabled}>
                                Google Login disabled: Invalid Client ID
                            </p>
                        )}
                    </div>

                    <p className={style.navigateText}>Don't have an account? <span className={style.navigateLink} onClick={() => {
                        setLogin(false);
                        setSignUp(true);
                    }} > Sign Up</span></p>
                </FormDiv>
            </Popup>
        )}
        
        {showOTP && (
            <OTPModal 
                identifier={identifier} 
                purpose="login"
                onClose={() => setShowOTP(false)}
                onSuccess={(data) => processLoginData(data)}
            />
        )}
        </>
    )
}

export default Loginpage