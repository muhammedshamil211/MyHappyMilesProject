import { useContext, useState } from 'react';
import toast from 'react-hot-toast';   
import Button from '../../component/user/components/ui/button/Button'
import Popup from '../../component/user/layout/Popup/Popup';
import CloseButton from '../../component/user/components/ui/closeButton/CloseButton';
import FormDiv from '../../component/user/layout/form/FormDiv'
import Input from '../../component/user/components/ui/inputArea/Input';
import style from './Loginpage.module.css'

import { LoginContext } from '../../context/LoginContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
function Loginpage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login, setLogin, setUser, setSignUp } = useContext(LoginContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');





    const validation = async () => {

        if (!email || !password) {
            toast.error('All fields required');
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Enter valid email");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/login", {
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
                localStorage.setItem('token', data.data.token);

                localStorage.setItem("user", JSON.stringify(data.data.user));
                setUser(data.data.user);
                toast.success(data.message || "Login successful");
                setLogin(false);


                if (data.data.user.role === 'admin') {
                    navigate('/admin');
                } else if (data.data.user.role === 'user') {
                    navigate(location.state?.from?.pathname || '/');
                }

                setTimeout(() => {
                    setLogin(false);
                }, 300);

            } else {
                toast.error(data.message || "Login failed!");
            }

        } catch (error) {
            toast.error("Server error");
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
        </>
    )
}

export default Loginpage