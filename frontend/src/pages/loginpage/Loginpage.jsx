
import { useContext, useState } from 'react';
import Button from '../../component/user/components/ui/button/Button'
import Popup from '../../component/user/layout/Popup/Popup';
import CloseButton from '../../component/user/components/ui/closeButton/CloseButton';
import FormDiv from '../../component/user/layout/form/FormDiv'
import Input from '../../component/user/components/ui/inputArea/Input';
import style from './Loginpage.module.css'

import { LoginContext } from '../../context/LoginContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Toast from '../../component/user/components/toast/Toast';

function Loginpage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login, setLogin, setUser, setSignUp } = useContext(LoginContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [toast, setToast] = useState(false);





    const validation = async () => {

        if (!email || !password) {
            setMessage('All fields required');
            setType('error');
            setToast(true);
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setMessage("Enter valid email");
            setType("error");
            setToast(true);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);

                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                setMessage(data.message || "Login successful");
                setType('success');
                setToast(true);
                setLogin(false);


                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else if (data.user.role === 'user') {
                    navigate(location.state?.from?.pathname || '/');
                }

                setTimeout(() => {
                    setLogin(false);
                }, 300);

            } else {
                setMessage(data.message || "Login failed!");
                setType('error');
                setToast(true);
            }

        } catch (error) {
            setMessage("Server error");
            setType('error');
            setToast(true);
            console.log(error);
        }
    }



    return (
        <>{login && (
            <Popup onClick={() => setLogin(false)}>

                <FormDiv padd={20}>

                    <CloseButton
                        onClick={() => setLogin(false)}
                    />
                    <p className={style.head}>Login</p>
                    <Input
                        type='text'
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value.trim())}
                    />
                    <Input
                        type='password'
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button text={"Login"} onClick={validation} />
                    <p className={style.navigateText}>Don't have an account? <span className={style.navigateLink} onClick={() => {
                        setLogin(false);
                        setSignUp(true);
                    }} > Sign Up</span></p>
                </FormDiv>
            </Popup>
        )}

            {toast && (
                <Toast
                    message={message}
                    type={type}
                    onClose={() => setToast(false)}
                />
            )}
        </>
    )
}

export default Loginpage