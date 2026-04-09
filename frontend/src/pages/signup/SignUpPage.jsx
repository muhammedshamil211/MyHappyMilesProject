import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import Button from '../../component/user/components/ui/button/Button';
import Popup from '../../component/user/layout/Popup/Popup';
import FormDiv from '../../component/user/layout/form/FormDiv'
import CloseButton from '../../component/user/components/ui/closeButton/CloseButton';
import Input from '../../component/user/components/ui/inputArea/Input';
import style from './SignUpPage.module.css'
import OTPModal from '../../component/auth/OTPModal';
import { LoginContext } from '../../context/LoginContext';

function SignUpPage() {

    const { signUp, setSignUp, setLogin } = useContext(LoginContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showOTP, setShowOTP] = useState(false); // After register, ask for email OTP

    if (!signUp) return null;


    const validation = async () => {

        if (!name || !email || !password) {
            setError('All fields are required');
            toast.error('All fields are required');
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Enter valid email");
            toast.error("Enter valid email");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message);
                // Account already exists — redirect to login
                if (data.message?.toLowerCase().includes('already')) {
                    setSignUp(false);
                    setLogin(true);
                }
            } else {
                // Account created — send OTP to verify email
                toast.success('Account created! Check your email for the OTP.');
                
                await fetch("http://localhost:5000/api/v1/auth/otp/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier: email, purpose: 'verify' })
                });

                // Switch to OTP verification step
                setShowOTP(true);
            }
        } catch (error) {
            toast.error('Server error');
        }
    }

    // After registration: show OTP verification step (not the signup form)
    if (showOTP) {
        return (
            <OTPModal
                identifier={email}
                purpose="verify"
                onClose={() => { setShowOTP(false); setSignUp(false); }}
                onSuccess={() => {
                    toast.success('Email verified! You can now log in.');
                    setShowOTP(false);
                    setSignUp(false);
                    setLogin(true); // Redirect to login after verification
                }}
            />
        );
    }

    return (
        <Popup onClick={() => setSignUp(false)}>

            <FormDiv padd={10}>
                <CloseButton onClick={() => setSignUp(false)} />
                <p className={style.head}>Sign Up</p>
                <Input
                    type="text"
                    placeholder="Enter your username"
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Enter your password (min 6 chars)"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button text={"Sign Up"} onClick={() => validation()} />
                <p className={style.navigateText}>Have an Account? <span className={style.navigateLink} onClick={() => {
                    setSignUp(false);
                    setLogin(true);
                }} > Login</span></p>
            </FormDiv>
        </Popup >

    );
}

export default SignUpPage