import { Input, Button, Chip } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { generateResetLink } from "~services/query/settings.queries";

export const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const [info, setInfo] = useState("");

    let timeout: number | null = null;

    const { mutate, isPending } = useMutation({
        mutationFn: generateResetLink,
        onSettled(data, error, variables, context) {
            setInfo(data!)

            timeout = setTimeout(() => {
                setInfo("")
            }, 2500)
        },
    })

    useEffect(() => {
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    })

    return (
        <div className='flex flex-col min-h-screen px-12 pb-16 pt-32 animate-appearance-in '>
            <header className={info ? "" : "mb-10"}>
                <h1 className='font-bold text-6xl uppercase pb-4'>Crowdspace.</h1>

                <div className="">
                    <h2 className='text-2xl font-light uppercase'>Forgot Password?</h2>
                    <h4 className='text-md font-extralight'>No worries. we'll send you a reset link</h4>
                </div>
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
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='mb-4'
                    classNames={{
                        label: "text-app-t-primary",
                        inputWrapper: 'bg-app-primary'
                    }}
                    label="Email"
                    type='email'
                    size='sm'
                    radius='md'
                    variant='bordered'
                />
                <Button
                    className='w-full'
                    color='primary'
                    radius='md'
                    size='md'
                    onPress={(e) => mutate(email)}
                    isDisabled={isPending}
                >
                    {
                        isPending ?
                            <LuLoader className="animate-spin" />
                            :
                            "Submit"
                    }
                </Button>
            </main>
        </div>
    );
};