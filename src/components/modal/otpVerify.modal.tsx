import {
    Button,
    Chip,
    Input,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader
} from '@nextui-org/react';
import { AxiosError } from 'axios';
import { FC, KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { userApiPublic } from '~services/api/axios-http';

import type { OtpArrayTuple } from '~types/components/otp';
import type { PressEvent } from '@react-types/shared';

type Props = {
    email: string | null,
    callback: Function,
    isOpen: boolean,
}


export const OtpVerifyModal: FC<Props> = ({ isOpen, email, callback }) => {

    const [isVerifying, setIsVerfying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const [otp, setOtp] = useState<OtpArrayTuple>(["", "", "", ""]);
    const inputRefs: RefObject<HTMLInputElement>[] = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    let timeout: number;

    useEffect(() => {
        if (isOpen) {
            inputRefs[0].current?.focus();
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "You haven't completed account verification. Are you sure you want to leave?";
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearTimeout(timeout)
        }
    }, [isOpen])

    const handleInput = (index: number, value: string) => {
        const regex = new RegExp(/^[0-9]+$/);

        if (!regex.test(value)) return;

        const newOTP: OtpArrayTuple = [...otp];
        newOTP[index] = value;

        setOtp(newOTP);

        if (index < 3 && value !== "") {
            inputRefs[index + 1].current?.focus();
        }
    }

    const handleBackspace = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] !== "") {
            e.preventDefault();

            const newOTP: OtpArrayTuple = [...otp];
            newOTP[index] = "";

            setOtp(newOTP);

            if (index > 0) {
                inputRefs[index - 1].current?.focus();
            }
        }
    }

    const handleVerify = async (e:PressEvent) => {
        setIsVerfying(true);

        if (!otp.some((value) => value === "")) {
            try {
                const { data } = await userApiPublic.post("/auth/verify-otp",
                    { email: email, otp: otp.join("") },
                );

                if (data.success) {
                    callback();
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setError(error.response?.data.message);
                    timeout = setTimeout(() => {
                        setError("");
                    }, 4000)
                }

            } finally {
                setIsVerfying(false);
            }
        }
    }

    const resendOtp = async (e:PressEvent) => {
        setIsSendingOtp(true);

        try {
            const { data } = await userApiPublic.post("/auth/gen-otp", { email });
            setInfo(data.message);
            timeout = setTimeout(() => {
                setInfo("");
            }, 4000)

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log("error", error.response);
                setInfo(error.response?.data.message);
                timeout = setTimeout(() => {
                    setInfo("");
                }, 4000)
            }

        } finally {
            setIsSendingOtp(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
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
