import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import googleIcon from "../../assets/google.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '../../services/store/user.slice';
import { LuLoader } from 'react-icons/lu';

export const Signup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/auth/login");
    };
    const navigateToCreate = () => {
        navigate("/auth/create");
    };

    const invokeGoogleAuth = useGoogleLogin({
        onSuccess: async (token) => {
            try{
                setIsSubmitting(true)
                const response = await axios.post("http://localhost:3000/auth/oauth-callback", {
                    code:token.code
                }, {
                    withCredentials: true
                })
    
                console.log(response);
                
                if(response.data.success){
                    dispatch(setUser(response.data.body));
                    setIsSubmitting(false);
                    navigate("/");
                }
                
            }catch(error){
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
        <div className='flex flex-col min-h-screen px-20 pb-20 pt-28 animate-appearance-in'>
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

