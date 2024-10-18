import { Button, Chip, Input } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { LuCheckCircle, LuEye, LuEyeOff, LuLoader, LuX } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import signupSchema from '../../schema/signupSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { userApiPublic } from '../../services/api/axios-http';
import { debounce } from '~utils/debounce';

export const CreateAccount = () => {
    const [usernameOk, setUsernameOk] = useState(undefined);
    const [Cpassword, setCPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [info, setInfo] = useState("");
    const navigate = useNavigate();

    const {
        register,
        setError,
        handleSubmit,
        clearErrors,
        trigger,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(signupSchema),
        mode: 'onTouched'
    });

    let timeout;

    useEffect(() => {

        return () => {
            clearTimeout(timeout);
        };
    }, []);


    const deb_CheckUsername = useCallback(debounce(async (event) => {
        const value = event.target.value;
        setUsernameOk("LOADING");

        if (value === "") {
            setUsernameOk(undefined);
            return;
        }

        try {
            console.timeEnd("debounce")
            const { data } = await userApiPublic.post("/auth/check-username", { username: value });

            if (data.success) {
                setUsernameOk(true);
            }
        } catch ({ response: { data } }) {
            console.log(data)
            if (!data.success) {
                setUsernameOk(false);
            }
        }
    }, 400), []);// dependency array


    const onSubmit = async (values) => {
        if (!usernameOk) {
            setError("username", { type: "usernameExistsError", message: "Username already exists" });
            return
        }

        if (values.password !== Cpassword) {
            setError("root.cpassword", { type: "pswdEqualError", message: "password doesn't match" });
            return
        }

        try {
            const { data } = await userApiPublic.post("/auth/register", values);
            console.log(data.success);

            if (data.success) {
                const res = await userApiPublic.post("/auth/gen-otp", {
                    email: data.body.email
                }, {
                    withCredentials: true
                });
                navigate("/auth/verify", { state: { email: data.body.email } })
            }

        } catch (error) {
            console.log(error.response.data);
            setInfo(error.response.data.message)

            timeout = setTimeout(() => {
                setInfo("");
            }, 4000)
        }

    }


    return (
        <div className='flex flex-col min-h-screen px-12 pb-12 pt-16 animate-appearance-in'>
            <header className='mb-6'>
                <h1 className='text-4xl font-light uppercase'>Sign up for</h1>
                <h2 className='font-bold text-6xl uppercase'>Crowdspace.</h2>
            </header>

            <main className='flex flex-col flex-grow mb-6 items-center'
                spellCheck={false}
            >
                {info &&
                    <Chip className='self-center my-2 animate-appearance-in'
                        color='danger'
                        radius="sm"
                        size='sm'
                        variant='flat'
                    >
                        {info}
                    </Chip>}
                <form className='w-full' onSubmit={handleSubmit(onSubmit)} >
                    <Input
                        {...register("email", {
                            required: "email is required",

                        })}
                        isInvalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}

                        className={errors.email?.message ? "mb-0 " : "mb-3 " + ""}
                        classNames={{
                            errorMessage: ["animate-slideDown"]
                        }}

                        label="Email"
                        type='email'
                        size='sm'
                        variant='bordered'
                        radius='md'
                    />
                    <Input
                        {...register("displayname", {
                            required: "display name is required",
                        })}

                        isInvalid={Boolean(errors.displayname)}
                        errorMessage={errors.displayname?.message}

                        className={errors.displayname?.message ? "mb-0" : "mb-3"}
                        classNames={{
                            errorMessage: ["animate-slideDown"]
                        }}

                        name='displayname'
                        label="Display Name"
                        type='text'
                        size='sm'
                        variant='bordered'
                        radius='md'
                    />
                    <Input
                        {...register("username", {
                            required: "username is required",
                            onChange: (e) => {
                                deb_CheckUsername(e);
                                trigger("username");
                            }
                        })}

                        isInvalid={Boolean(errors.username)}
                        errorMessage={errors.username?.message}

                        className={errors.username?.message ? "mb-0" : "mb-3"}
                        classNames={{
                            input: ["lowercase"],
                            errorMessage: ["animate-slideDown"]
                        }}

                        name='username'
                        label="Username"
                        type='text'
                        size='sm'
                        variant='bordered'
                        radius='md'
                        endContent={
                            usernameOk === undefined ? undefined :
                                usernameOk === "LOADING" ? <LuLoader className='self-center animate-spin' size={20} color='grey' /> :
                                    usernameOk === false ?
                                        <LuX className='self-center animate-appearance-in' size={20} color='red' /> :
                                        <LuCheckCircle className='self-center animate-appearance-in' size={20} color='limeGreen' />
                        }
                    />
                    <Input
                        {...register("password", {
                            required: "password is required",

                        })}
                        isInvalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}

                        className={errors.password?.message ? "mb-0" : "mb-3"}
                        classNames={{
                            errorMessage: ["animate-slideDown"]
                        }}

                        type={isVisible ? "text" : "password"}

                        name='password'
                        label="Password"
                        size='sm'
                        variant='bordered'
                        radius='md'

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
                    />
                    <Input
                        isInvalid={Boolean(errors.root?.cpassword)}
                        errorMessage={errors.root?.cpassword?.message}
                        name='cpassword'

                        className="mb-3"
                        classNames={{
                            errorMessage: ["animate-slideDown"]
                        }}

                        label="Confirm Password"
                        type='password'
                        onFocus={() => {
                            clearErrors("root.cpassword");
                        }}
                        onChange={(e) => { setCPassword(e.target.value) }}
                        size='sm'
                        variant='bordered'
                        radius='md'
                    />
                    <Button
                        className='w-full'
                        color='primary'
                        radius='md'
                        type='submit'
                    >
                        {isSubmitting ?
                            <LuLoader className='animate-spin' size={18} color='white' />
                            : "Submit"}
                    </Button>

                </form>
            </main>

            <footer className='text-center'>
                <div className='flex flex-col space-y-2'>
                    <p className='font-medium text-sm'>Already have an account?
                        <Link to='/auth/login' className='hover:underline font-semibold text-blue-600'>{" "}Login</Link>
                    </p>
                    <Link to="/auth/signup" className='text-gray-500 font-normal text-sm hover:underline text '>Other signup options</Link>
                </div>
            </footer>
        </div>
    );
};
