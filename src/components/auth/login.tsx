import { Button, Chip, Input } from '@nextui-org/react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { OtpVerifyModal } from '../modal/otpVerify.modal';
import { LuEye, LuEyeOff, LuLoader } from 'react-icons/lu';
import { setUser } from '../../services/state/user.slice';
import { userApiPublic } from '../../services/api/axios-http';
import { useAppDispatch } from '~hooks/useReduxHooks';
import { AxiosError } from 'axios';

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [email, setEmail] = useState<string | null>(null);
    const [info, setInfo] = useState("");
    const [isOpen, setIsOpen] = useState(false);


    let timeout: ReturnType<typeof setTimeout>;

    useEffect(() => {

        return () => {
            clearTimeout(timeout)
        }
    })

    const callback = () => {
        setIsOpen(false)
        buttonRef.current?.click();
    }

    const onSubmit = async (data: FieldValues) => {
        const isEmail = z.string().email().safeParse(data.credential).success;

        const newData = {
            ...data,
            type: isEmail ? "email" : "username"
        }

        try {
            setIsSubmitting(true)
            const { data } = await userApiPublic.post("/auth/login", newData);

            if (data.success) {
                dispatch(setUser(data.body));
                navigate("/");
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;

                if (response?.status === 404 || response?.status === 400) {
                    setInfo(response?.data.message);

                    timeout = setTimeout(() => {
                        setInfo("");
                    }, 5000)

                } else {
                    if (!response?.data.body.isVerified) {

                        setInfo("Account not yet verified. An OTP has been sent to your email.");
                        timeout = setTimeout(() => {
                            setInfo("");
                        }, 5000)

                        const res = await userApiPublic.post("/auth/gen-otp", {
                            email: response?.data.body.email
                        });

                        setEmail(response?.data.body.email);
                        setIsOpen(true);
                    }
                }
            }

        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className='flex flex-col min-h-screen px-12 pb-16 pt-32 animate-appearance-in '>
            <header className={info ? "" : "mb-10"}>
                <h1 className='text-4xl font-light uppercase'>Login to</h1>
                <h2 className='font-bold text-6xl uppercase'>Crowdspace.</h2>
            </header>

            <main className='flex flex-col flex-grow mb-6 items-center' spellCheck={false}>
                {info &&
                    <Chip className='self-center my-2 animate-appearance-in'
                        color='danger'
                        radius="sm"
                        size='sm'
                        variant='flat'
                    >
                        {info}
                    </Chip>}
                <Input //supports either username/email
                    {...register("credential", {
                        required: true
                    })}
                    className='mb-4'
                    label="Email / Username"
                    type='text'
                    size='sm'
                    radius='md'
                    variant='bordered'
                />
                <Input
                    {...register("password", {
                        required: true
                    })}

                    type={isVisible ? "text" : 'password'}

                    className='mb-2'
                    classNames={{
                        description: ["self-end"]
                    }}
                    label="Password"
                    radius='md'
                    size='sm'
                    variant='bordered'
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // e.preventDefault(); //try event.stopPropogation in the eventHandler
                            // buttonRef.current.click();

                            handleSubmit(onSubmit)();
                        }
                    }}
                    endContent={isVisible ?
                        (
                            <LuEyeOff className='self-center animate-appearance-in cursor-pointer' color='silver' size={18}
                                onClick={() => {
                                    setIsVisible(false)
                                }}
                            />
                        ) :
                        (
                            <LuEye className='self-center animate-appearance-in cursor-pointer' color='silver' size={18}
                                onClick={() => {
                                    setIsVisible(true)
                                }}
                            />
                        )
                    }
                    description={<Link to="/forgot-pwd">forgot password?</Link>}
                />

                <Button
                    className='w-full'
                    color='primary'
                    radius='md'
                    size='md'
                    onPress={(e)=>{
                        handleSubmit(onSubmit)();
                    }}
                    ref={buttonRef}
                >
                    {isSubmitting ?
                        <LuLoader className='animate-spin'></LuLoader> :
                        "Submit"}
                </Button>
            </main>

            <footer className='text-center'>
                <p className='font-normal text-sm mb-2'>Don't have an account yet?
                    <Link to='/auth/signup' className='font-semibold hover:underline text-blue-600'>{" "}Signup</Link>
                </p>
            </footer>

            <OtpVerifyModal isOpen={isOpen} email={email} callback={callback} />
        </div>
    )
}
