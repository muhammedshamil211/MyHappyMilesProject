import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Popup from '../user/layout/Popup/Popup';
import FormDiv from '../user/layout/form/FormDiv';
import CloseButton from '../user/components/ui/closeButton/CloseButton';
import Input from '../user/components/ui/inputArea/Input';
import Button from '../user/components/ui/button/Button';
import style from './OTPModal.module.css';

export default function OTPModal({ 
    identifier, 
    purpose, // 'login' or 'verify'
    onClose, 
    onSuccess 
}) {
    const [code, setCode] = useState('');

    const verify = async () => {
        if (!code || code.length !== 6) {
            toast.error("Enter valid 6-digit OTP");
            return;
        }

        const endpoint = purpose === 'login' ? '/verify/mobile' : '/verify/email';
        
        try {
            const res = await fetch(`http://localhost:5000/api/v1/auth/otp${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, email: identifier, code })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                onSuccess(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Verification failed");
        }
    };

    return (
        <Popup onClick={onClose}>
            <FormDiv padd={20}>
                <CloseButton onClick={onClose} />
                <p className={style.title}>Enter OTP</p>
                <p className={style.subtitle}>
                    A 6-digit code has been sent to <b>{identifier}</b>
                </p>
                
                <Input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    onChange={(e) => setCode(e.target.value)}
                />
                
                <Button text={"Verify OTP"} onClick={verify} />
            </FormDiv>
        </Popup>
    );
}
