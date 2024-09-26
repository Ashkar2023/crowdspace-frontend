import { Button, Input } from "@nextui-org/react"
import { current } from "@reduxjs/toolkit"
import { span } from "framer-motion/client"
import { useEffect, useRef, useState } from "react"
import { LuLoader } from "react-icons/lu"

export const OtpVerify = () => {
    const [isVerifying, setIsVerfying] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null),];


    useEffect(() => {
        inputRefs[0].current.focus();

    }, [])

    const handleInput = (index, value) => {
        const newOTP = [...otp];
        newOTP[index] = value;

        setOtp(newOTP);

        if (index < 3 && value !== "") inputRefs[index + 1].current.focus();
    }

    const handleBackspace = (index, e) => {
        if (e.key === 'Backspace' && otp[index] !== "" && index > 0) {
            e.preventDefault();
            const newOTP = [...otp];
            newOTP[index] = "";
            setOtp(newOTP);

            inputRefs[index - 1].current.focus();
        }
    }

    const handleVerify = () => {
        
    }

    const resendOtp = () => {

    }

    return (
        <div className='flex flex-col justify-center min-h-screen px-12 min-w-96 animate-appearance-in'>
            <header className='mb-4'>
                <h1 className='text-4xl font-light uppercase'>Verify</h1>
                <h2 className='font-bold text-6xl uppercase'>OTP</h2>
                <p className="font-light"><span className="font-medium">Crowdspace</span> has sent you an OTP-mail</p>
            </header>

            <main className='flex flex-col mb-6 items-center' spellCheck={false}>
                <div className="flex min-w-60 max-w-80 mb-3 gap-2">
                    {otp.map((value, index) => (
                        <Input
                            key={index}
                            variant="bordered"
                            ref={inputRefs[index]}
                            classNames={{ input: ["text-center"] }}
                            value={value}
                            maxLength={1}
                            onKeyDown={(e) => { handleBackspace(index, e) }}
                            onChange={(e) => { handleInput(index, e.target.value) }}

                        />
                    ))}
                </div>

                <Button
                    className='w-full'
                    color='primary'
                    radius='md'
                    onClick={(e) => { }}
                >
                    {isVerifying ?
                        <LuLoader className='animate-spin' size={18} color='white' />
                        : "Verify"}
                </Button>
            </main>

            <footer className='text-center'>
                <Button
                    className='font-normal text-xs mb-2'
                    variant="light"
                    size="sm"
                    disabled={sendingOtp}
                >
                    {sendingOtp ?
                        <span className="flex gap-2 text-gray-400"><LuLoader className='animate-spin' size={16} />Sending Otp</span>
                        : "Resend OTP"}
                </Button>
            </footer>
        </div>
    )
}
