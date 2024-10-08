import { Button, Chip, Input } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react"
import { LuLoader } from "react-icons/lu"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { setUser } from "../../services/store/user.slice"
import { axiosPublic } from "../../services/api/axios-http"

export const OtpVerify = () => {
    const location = useLocation();
    const [email] = useState(location.state.email || "");
    const [isVerifying, setIsVerfying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("")
    const [info, setInfo] = useState("")

    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null),];

    if (!email) navigate("/auth/login")

    let timeout;

    useEffect(() => {
        inputRefs[0].current.focus();

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "You haven't completed account verification. Are you sure you want to leave?";
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload); //the callback should be a named fn, and the references should be same. anonymous functions will not work.
            clearTimeout(timeout);
        }
    }, [])

    const handleInput = (index, value) => {
        const regex = new RegExp(/^[0-9]+$/);

        if (!regex.test(value)) return;

        const newOTP = Array.from(otp);
        newOTP[index] = value;

        setOtp(newOTP);

        if (index < 3 && value !== "") {
            inputRefs[index + 1].current.focus();
        }
    }

    const handleBackspace = (index, e) => {
        if (e.key === 'Backspace' && otp[index] !== "") {
            e.preventDefault();
            const newOTP = [...otp];
            newOTP[index] = "";
            setOtp(newOTP);

            if (index > 0) {
                inputRefs[index - 1].current.focus();
            }

        }
    }

    const handleVerify = async (e) => {
        setIsVerfying(true);

        if (!otp.some((value) => value === "")) {
            try {
                const { data } = await axiosPublic.post("/auth/verify-otp",
                    {
                        email: email,
                        otp: otp.join("")
                    });

                if (data.success) {
                    dispatch(setUser(data.body));
                    navigate("/");
                }
            } catch (error) {
                console.log("error", error.response)  //DELETE
                setError(error.response.data.message);
                timeout = setTimeout(() => {
                    setError("");
                }, 4000)

            } finally {
                setIsVerfying(false);
            }
        }
    }

    const resendOtp = async (e) => {
        setIsSendingOtp(true);

        try {
            const { data } = await axios.post("http://localhost:3000/auth/gen-otp", { email });
            setInfo(data.message);
            timeout = setTimeout(() => {
                setInfo("");
            }, 4000)

        } catch (error) {
            console.log("error", error.response);
            setInfo(error.response.data.message);
            timeout = setTimeout(() => {
                setInfo("");
            }, 4000)

        } finally {
            setIsSendingOtp(false);
        }
    }

    return (
        <div className='flex flex-col justify-center min-h-screen px-20 min-w-96 animate-appearance-in'>
            <header className='mb-4'>
                <h1 className='text-4xl font-light uppercase'>Verify</h1>
                <h2 className='font-bold text-6xl uppercase'>OTP</h2>
                <p className="font-light"><span className="font-medium">Crowdspace</span> has sent you an OTP-mail</p>
            </header>

            <main className='flex flex-col mb-6 items-center' spellCheck={false}>
                {info &&
                    <Chip className='self-center my-2 animate-appearance-in'
                        color='success'
                        radius="sm"
                        size='sm'
                        variant='flat'
                    >
                        {info}
                    </Chip>}
                {error &&
                    <Chip className='self-center my-2 animate-appearance-in'
                        color='danger'
                        radius="sm"
                        size='sm'
                        variant='flat'
                    >
                        {error}
                    </Chip>}
                <div className="flex min-w-60 max-w-80 mb-3 gap-2">
                    {otp.map((value, index) => (
                        <Input
                            key={index}
                            variant="bordered"
                            type="text"
                            pattern=""
                            ref={inputRefs[index]}
                            classNames={{ input: ["text-center"] }}
                            value={value}
                            maxLength={1}
                            onKeyDown={(e) => { handleBackspace(index, e) }}
                            onChange={(e) => { handleInput(index, e.target.value) }}

                        />
                    ))}
                </div>

                <Button
                    className='w-full'
                    color='primary'
                    radius='md'
                    onClick={handleVerify}
                >
                    {isVerifying ?
                        <LuLoader className='animate-spin' size={18} color='white' />
                        : "Verify"}
                </Button>
            </main>

            <footer className='text-center'>
                <Button
                    className='font-normal text-xs mb-2'
                    variant="light"
                    size="sm"
                    onPress={resendOtp}
                    disabled={isSendingOtp || isVerifying}
                >
                    {isSendingOtp ?
                        <span className="flex gap-2 text-gray-400"><LuLoader className='animate-spin' size={16} />Sending Otp</span>
                        : "Resend OTP"}
                </Button>
            </footer>
        </div>
    )
}
