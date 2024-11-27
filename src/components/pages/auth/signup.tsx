import googleIcon from "~assets/google.svg";
import CrowdspaceIcon from "~assets/crowdspace-logo-light-theme.svg";

import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { setUser } from '~services/state/user.slice';
import { LuLoader } from 'react-icons/lu';
import { userApiPublic } from '~services/api/user.api';
import { useAppDispatch } from "~hooks/useReduxHooks";

export const Signup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/auth/login");
    };
    const navigateToCreate = () => {
        navigate("/auth/create");
    };

    const invokeGoogleAuth = useGoogleLogin({
        onSuccess: async (token) => {
            try {
                setIsSubmitting(true)
                const response = await userApiPublic.post("/auth/oauth-callback", {
                    code: token.code
                })

                console.log(response);

                if (response.data.success) {
                    dispatch(setUser(response.data.body));
                    setIsSubmitting(false);
                    navigate("/");
                }

            } catch (error) {
                console.log(error)
            }
        },
        onError: (token) => {
            console.log(token)
        },
        flow: "auth-code"
    })

    useEffect(() => {
        console.log("signup mounted");

        return () => {
            console.log("signup unmounted");
        }
    }, [])

    return (
        <div className='flex flex-col items-center min-h-screen px-20 pb-20 pt-28 animate-appearance-in'>
            <header className='flex md:self-start md:mt-0 md:mb-10 mt-20 mb-20'>
                <img
                    className="md:h-[70px] h-full pr-3 self-center md:hidden"
                    src={CrowdspaceIcon} alt="Crowdspace logo"
                />
                <div>
                    <h2 className='md:text-6xl text-4xl font-bold antialiased'>Crowdspace.</h2>
                    <h4 className='md:text-3xl text-2xl font-bold indent-0 md:indent-2'>join Now.</h4>
                </div>
            </header>

            <main className='w-max flex flex-col flex-grow mb-6'>
                <Button startContent={<img src={googleIcon} className='h-8' />}
                    size='md'
                    className='w-80 font-semibold'
                    onPress={(e) => {
                        invokeGoogleAuth();
                    }}
                >
                    {isSubmitting ?
                        <LuLoader className='animate-spin'></LuLoader> :
                        "Sign up with Google"}
                </Button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 font-medium">Or</span>
                    </div>
                </div>

                <Button
                    size='md'
                    className='w-80 font-semibold text-white' //change colors to theme based
                    color='primary'
                    onPress={navigateToCreate}
                >
                    Create Account
                </Button>
            </main>

            <footer className='text-center'>
                <p className='text-sm font-medium mb-2'>Already have an account?</p>
                <Button
                    size='sm'
                    className='w-44 font-semibold' //change colors to theme based
                    color='primary'
                    variant='bordered'
                    onPress={navigateToLogin}
                >
                    Login
                </Button>
            </footer>

        </div>
    )
}

