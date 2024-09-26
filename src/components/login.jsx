import { Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { OtpVerifyModal } from './modal/otpVerify.modal';

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [email, setEmail] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const isEmail = z.string().email().safeParse(data.credential).success;

        const newData = {
            ...data,
            type: isEmail ? "email" : "username"
        }

        try {
            const { data } = await axios.post("http://localhost:3000/auth/login", newData, {
                withCredentials: true
            });
            console.log(data); // DELETE

            if (data.success) {
                dispatch(setUser(data.body));
                navigate("/");              
            }

        } catch (error) {
            const { response: { data } } = error;
            console.log(error)
            console.log(!data.body.isVerified)

            if (!data.body.isVerified) {
                // const response = await axios.post("http://localhost:3000/auth/sendotp", body, {
                //     withCredentials: true
                // });

                // if (!response.data.success) {
                //     setEmail(body.email);
                //     setIsOpen(true);
                // }
                if (true) {
                    // setEmail(body.email);
                    setIsOpen(true);
                }
            }
        }
    }


    return (
        <div className='flex flex-col min-h-screen px-12 pb-16 pt-20 animate-appearance-in '>
            <header className='mb-10'>
                <h1 className='text-4xl font-light uppercase'>Login to</h1>
                <h2 className='font-bold text-6xl uppercase'>Crowdspace.</h2>
            </header>

            <main className='flex flex-col flex-grow mb-6 items-center' spellCheck={false}>
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
                    className='mb-4'
                    label="Password"
                    type='password'
                    radius='md'
                    size='sm'
                    variant='bordered'
                />

                <Button
                    className='w-full'
                    color='primary'
                    radius='md'
                    size='md'
                    onPress={handleSubmit(onSubmit)}
                >
                    Submit
                </Button>
            </main>

            <footer className='text-center'>
                <p className='font-normal text-sm mb-2'>Don't have an account yet?
                    <Link to='/auth/signup' className='font-semibold hover:underline text-blue-600'>{" "}Signup</Link>
                </p>
            </footer>

            <OtpVerifyModal isOpen={isOpen} email={email} />
        </div>
    )
}
