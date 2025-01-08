
// CallScreen Component
import { Dispatch, FC, SetStateAction, useContext, useEffect, useRef } from "react";
import { ControlState } from "../call.page";
import { Button } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { SocketEvents } from "~constants/socket.events";
import { SocketContext } from "~/context/socketContext";
import toast from "react-hot-toast";
import { toastSuccessTheme } from "~config/toastTheme.config";

type Props = {
    localStream: MediaStream | null;
    controlsState: ControlState;
    setControlState: Dispatch<SetStateAction<ControlState>>;
    setConnected: Dispatch<SetStateAction<boolean>>;
    remoteStream: MediaStream | null
    rtcPeerConnection: RTCPeerConnection | null,
    setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>
};

const CallScreen: FC<Props> = ({
    localStream, controlsState,
    rtcPeerConnection,
    remoteStream,
    setControlState, setConnected,
    setRemoteStream
}) => {
    const { pathname } = useLocation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const { Socket } = useContext(SocketContext);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current!.srcObject = remoteStream;

            Socket?.on(SocketEvents.call_ended, handleCallEnded)
            console.log("set")
        }

        return () => {
            Socket?.off(SocketEvents.call_ended, handleCallEnded)
            console.log("removed")
        }

    }, [remoteStream])

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }

        console.log(pathname.split("/"))
        console.log(pathname.split("/")[1])
    }, [localStream]);

    const endCall = () => {
        console.log("Ending call...");

        if (rtcPeerConnection) {
            rtcPeerConnection.ontrack = null;
            rtcPeerConnection.onicecandidate = null;
            rtcPeerConnection.onconnectionstatechange = null;
            rtcPeerConnection.close();
        }

        Socket?.emit(SocketEvents.call_end, { roomId: pathname.split("/")[2] }); // array will be ["", "call", "67728edd96dab89ac6d737b8"]

        setConnected(false);
        setRemoteStream(null);
        // setControlState({
        //     mic: true,
        //     camera: true,
        // });

        toast.success("Call ended", {
            duration: 2000,
            position: "top-center",
            style: toastSuccessTheme
        });
    }

    const handleCallEnded = () => {
        console.log("Call ended by the other user");

        if (rtcPeerConnection) {
            rtcPeerConnection.ontrack = null;
            rtcPeerConnection.onicecandidate = null;
            rtcPeerConnection.onconnectionstatechange = null;
            rtcPeerConnection.close();
        }

        setConnected(false);
        setRemoteStream(null);
        // setControlState({
        //     mic: true,
        //     camera: true,
        // });

        toast("The call was ended by the other user", {
            duration: 2000,
            position: "top-center",
            style: toastSuccessTheme
        });
    };

    return (
        <div className="h-full w-full relative place-content-center plcae place-items-center">
            {/* caller */}
            <video
                ref={videoRef}
                className="h-[20%] absolute bottom-10 right-10 rounded-lg"
                autoPlay
                muted={!controlsState.mic}
            />

            {/* callee */}
            <video
                ref={remoteVideoRef}
                className="h-[90%]"
                autoPlay
                muted
            />
            <Button
                color="danger"
                className="font-semibold"
                onPress={endCall}
            >
                End Call
            </Button>
        </div>
    );
};

export default CallScreen;