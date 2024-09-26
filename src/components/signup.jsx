import { Button } from '@nextui-org/react';
import React, { useEffect } from 'react';
import googleIcon from "../assets/google.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Signup = () => {

    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/auth/login");
    };
    const navigateToCreate = () => {
        navigate("/auth/create");
    };

    const invokeGoogleAuth = async (e) => {
        const { data } = await axios.get("http://localhost:3000/auth/generate-url");

        console.log(data.body.authorizeUrl);
        window.open(
            data.body.authorizeUrl,
            "GoogleOAuth",
            `width=900,height=550,left=${window.screen.width / 2 - 450},top=${window.screen.height / 2 - 275}`
        );
    }

    useEffect(() => {
        console.log("signup mounted");

        return () => {
            console.log("signup unmounted");

        }
    }, [])

    return (
        <div className='flex flex-col min-h-screen px-12 pb-20 pt-28 animate-appearance-in'>
            <header className='mb-10'>
                <h2 className='text-5xl font-bold '>Crowdspace.</h2>
                <h4 className='text-3xl font-bold '>join Now.</h4>
            </header>

            <main className='w-fit flex flex-col flex-grow mb-6'>
                <Button startContent={<img src={googleIcon} className='h-8' />}
                    size='md'
                    className='w-80 font-semibold'
                    onPress={(e) => {
                        invokeGoogleAuth(e)
                    }}
                >
                    Sign up with Google
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

            <footer>
                <p className='font-semibold mb-2'>Already have an account?</p>
                <Button
                    size='md'
                    className='w-52 font-semibold' //change colors to theme based
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

