import { Button, Input, Chip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LuLoader, LuEye, LuEyeOff } from 'react-icons/lu';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { resetPassword } from '~services/query/settings.queries';
import { resetPasswordSchema } from '~schema/passwordSchema';
import { useParams } from 'react-router-dom';

export const ResetPassword = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [Cpassword, setCPassword] = useState<string>("");
    const [info, setInfo] = useState<string>("");

    let timeout: number | null = null;

    const {
        register,
        setError,
        handleSubmit,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onTouched'
    });

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassword,
        onSettled(data, error, variables, context) {
            if (data?.success) {
                setInfo(data.message);
            } else if (error instanceof AxiosError) {
                setInfo(error.response?.data.message);
            }

            timeout = setTimeout(() => {
                setInfo("")
            }, 2500)
        },
    });

    useEffect(() => {
        () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    })

    const onSubmit = async (values: FieldValues) => {
        if (values.password !== Cpassword.trim()) {
            setError("root.cpassword", { type: "pswdEqualError", message: "password doesn't match" });
            return;
        }
        const token = new URL(window.location.href).searchParams.get("token");

        if (!token) {
            setInfo("token not found");
            timeout = setTimeout(() => {
                setInfo("")
            }, 2500)

            return
        }

        mutate({ newPassword: values.password, token });
    };

    return (
        <div className='flex flex-col min-h-screen px-12 pb-16 pt-32 animate-appearance-in'>
            <header className={info ? "" : "mb-10"}>
                <h2 className='font-bold text-6xl uppercase'>Crowdspace.</h2>
                <h1 className='text-4xl font-extralight uppercase'>Reset Password</h1>
            </header>

            <main className='flex flex-col flex-grow mb-6 items-center' spellCheck={false}>
                {info &&
                    <Chip className='self-center my-2 animate-appearance-in'
                        color='success'
                        radius="sm"
                        size='sm'
                        variant='flat'
                    >
                        {info}
                    </Chip>
                }
                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        {...register("password", {
                            required: "password is required",
                        })}
                        isInvalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message as string}
                        className={errors.password?.message ? "mb-0" : "mb-3"}
                        classNames={{
                            errorMessage: ["animate-slideDown"]
                        }}
                        type={isVisible ? "text" : "password"}
                        name='password'
                        label="New password"
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
                        isDisabled={isPending}
                        type='submit'
                    >
                        {isPending ?
                            <LuLoader className='animate-spin' size={18} color='white' />
                            : "Submit"}
                    </Button>
                </form>
            </main>
        </div>
    );
};