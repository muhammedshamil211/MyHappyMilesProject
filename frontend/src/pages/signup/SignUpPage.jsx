import React, { useContext, useState } from 'react'
import Button from '../../component/user/components/ui/button/Button';
import Popup from '../../component/user/layout/Popup/Popup';
import FormDiv from '../../component/user/layout/form/FormDiv'
import CloseButton from '../../component/user/components/ui/closeButton/CloseButton';
import Input from '../../component/user/components/ui/inputArea/Input';
import style from './SignUpPage.module.css'
import { LoginContext } from '../../context/LoginContext';

function SignUpPage() {

    const { signUp, setSignUp, setLogin } = useContext(LoginContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!signUp) return null;


    const validation = async () => {

        if (!name || !email || !password) {
            setError('All fields are required');
            alert(error);
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Enter valid email");
            alert(error);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            alert(error);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message);
                setSignUp(false);
                setLogin(true);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Server error');
            console.log(error)
        }
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
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button text={"Sign Up"} onClick={() => validation()} />
                <p className={style.navigateText}>Have an Account? <span className={style.navigateLink} onClick={() => {
                    setSignUp(false);
                    setLogin(true);
                }} > Login</span></p>
            </FormDiv>
        </Popup >

    )
}

export default SignUpPage