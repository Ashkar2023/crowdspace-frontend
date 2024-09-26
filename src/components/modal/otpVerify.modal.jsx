import {
    Button,
    Chip,
    Input,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader
} from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { LuLoader } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { setUser } from '../../services/store/user.slice';

export const OtpVerifyModal = ({ isOpen, onOpenChange, email }) => {
    const [isVerifying, setIsVerfying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null),];

    let timeout;

    useEffect(() => {
        if (isOpen) {
            inputRefs[0].current.focus();
        }


        return () => {
            clearTimeout(timeout);
        }
    }, [isOpen])

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

    const handleVerify = async () => {
        isVerifying(true);

        if (!otp.some((value) => value === "")) {
            try {
                const { data } = await axios.post("http://localhost:3000/auth/verifyotp",
                    { email: email, otp: otp.join("") },
                    {
                        withCredentials: true
                    });

                if (data.success) {
                    dispatch(setUser(data.body));
                    Navigate("/")
                }
            } catch (error) {
                console.log(error.response)  //DELETE
                setError(error.response.data.body.message);
                timeout = setTimeout(() => {
                    setError("");
                }, 4000)
            }

        }

        isVerifying(false);
    }

    const resendOtp = () => {

    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="sm"
            isDismissable={false}
            hideCloseButton={true}
            placement="center"
        >
            <ModalContent className="py-8 px-12">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-4xl font-light uppercase">Verify</h1>
                            <h2 className="font-bold text-6xl uppercase">OTP</h2>
                            <p className="font-light text-sm">Verify your account</p>
                        </ModalHeader>
                        <ModalBody>
                            {error &&
                                <Chip className='self-center'
                                    color='danger'
                                    radius="sm"
                                    variant='flat'
                                >
                                    {error}
                                </Chip>}
                            <div className="flex justify-between">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="number"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        ref={inputRefs[index]}
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
                                onPress={(e) => { handleVerify }}
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
                                onPress={(e) => {
                                    console.log('resend')
                                }}
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
