import {
    Button,
    Chip,
    Input,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader
} from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const OtpVerifyModal = ({ isOpen, onOpenChange, email, callback }) => {
    const [isVerifying, setIsVerfying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null),];


    useEffect(() => {
        if (isOpen) {
            inputRefs[0].current.focus();
        }

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "You haven't completed account verification. Are you sure you want to leave?";
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [isOpen])

    const handleInput = (index, value) => {
        const regex = new RegExp(/^[0-9]+$/);

        if (!regex.test(value)) return;

        const newOTP = Array.from(otp);
        newOTP[index] = value;

        setOtp(newOTP);

        if (index < 3 && value !== "") {
            inputRefs[index + 1].current.focus();
        }
    }

    const handleBackspace = (index, e) => {
        if (e.key === 'Backspace' && otp[index] !== "") {
            e.preventDefault();
            const newOTP = [...otp];
            newOTP[index] = "";
            setOtp(newOTP);

            if (index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    }

    const handleVerify = async (e) => {
        setIsVerfying(true);

        if (!otp.some((value) => value === "")) {
            try {
                const { data } = await axios.post("http://localhost:3000/auth/verify-otp",
                    { email: email, otp: otp.join("") },
                    {
                        withCredentials: true
                    });

                console.log(data);
                if (data.success) {
                    callback();
                    onOpenChange(false);
                }
            } catch (error) {
                console.log("error", error.response)  //DELETE
                setError(error.response.data.message);
                timeout = setTimeout(() => {
                    setError("");
                }, 4000)

            } finally {
                setIsVerfying(false);
            }
        }
    }

    const resendOtp = async (e) => {
        setIsSendingOtp(true);

        try {
            const { data } = await axios.post("http://localhost:3000/auth/gen-otp", { email });
            setInfo(data.message);
            timeout = setTimeout(() => {
                setInfo("");
            }, 4000)

        } catch (error) {
            console.log("error", error.response);
            setInfo(error.response.data.message);
            timeout = setTimeout(() => {
                setInfo("");
            }, 4000)

        } finally {
            setIsSendingOtp(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="xs"
            isDismissable={false}
            hideCloseButton={true}
            placement="center"
        >
            <ModalContent className="py-8 px-10">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-4xl font-light uppercase">Verify</h1>
                            <h2 className="font-bold text-6xl uppercase">OTP</h2>
                            <p className="font-light text-sm">Verify your account to login</p>
                        </ModalHeader>
                        <ModalBody>
                            {info &&
                                <Chip className='self-center animate-appearance-in'
                                    color='success'
                                    radius="sm"
                                    size='sm'
                                    variant='flat'
                                >
                                    {info}
                                </Chip>}
                            {error &&
                                <Chip className='self-center animate-appearance-in'
                                    color='danger'
                                    radius="sm"
                                    size='sm'
                                    variant='flat'
                                >
                                    {error}
                                </Chip>}
                            <div className="flex justify-between gap-1">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type='text'
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInput(index, e.target.value)}
                                        onKeyDown={(e) => handleBackspace(index, e)}
                                        className="w-14"
                                        classNames={{ input: ["text-center"] }}
                                        size="lg"
                                        variant="bordered"
                                    />
                                ))}
                            </div>
                            <Button
                                color="primary"
                                size="lg"
                                className="w-full mt-4"
                                onPress={handleVerify}
                                isDisabled={isVerifying || isSendingOtp}
                            >
                                {isVerifying ? (
                                    <LuLoader className="animate-spin mr-2" size={18} color="white" />
                                ) : "Verify"}
                            </Button>
                        </ModalBody>
                        <ModalFooter className="justify-center">
                            <Button
                                className=''
                                variant="light"
                                size="sm"
                                onPress={resendOtp}
                                disabled={isSendingOtp || isVerifying}
                            >
                                {isSendingOtp ? (
                                    <span className="flex items-center gap-2">
                                        <LuLoader className="animate-spin" size={14} color="currentColor" />
                                        Sending OTP
                                    </span>
                                ) : "Resend OTP"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
