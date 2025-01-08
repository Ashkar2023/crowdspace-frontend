import { useEffect, useRef, useState } from "react";
import Lobby from "./partials/lobby";
import CallScreen from "./partials/callScreen";
import { LuLoader2 } from "react-icons/lu";

export type ControlState = {
    mic: boolean;
    camera: boolean;
};

export const CallPage = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [connected, setConnected] = useState<boolean>(false);
    const [controlsState, setControlsState] = useState<ControlState>({ mic: false, camera: true });
    const rtcPeerConnection = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                audio: {
                    noiseSuppression: true,
                    echoCancellation: true,
                },
                video: {
                    facingMode: "user",
                    frameRate: { ideal: 30, max: 50 },
                    height: { min: 720, ideal: 1080, max: 1080 },
                    width: { min: 1280, ideal: 1920, max: 1920 },
                    aspectRatio: { ideal: 1.7777777777777777 },
                },
            })
            .then((stream) => setLocalStream(stream))
            .catch((error) => console.error("Error accessing media devices:", error));

        return () => {
            console.log("CallPage unmounted");
            localStream?.getTracks().forEach((track) => track.stop());// ensure the cleanup happens

            if (rtcPeerConnection.current) {
                rtcPeerConnection.current?.close();
                console.log("PC cleared:", rtcPeerConnection.current.connectionState)
                rtcPeerConnection.current = null;
            }
        };
    }, []);

    return (
        <div className={`grid ${!connected ? "place-content-center" : ""} h-screen w-full bg-app-primary`}>
            {
                !connected && localStream ?
                    <Lobby
                        setRemoteStream={setRemoteStream}
                        localStream={localStream}
                        controlsState={controlsState}
                        setControlState={setControlsState}
                        setConnected={setConnected}
                        rtcPeerConnection={rtcPeerConnection.current}
                    />
                    :
                    <CallScreen
                        rtcPeerConnection={rtcPeerConnection.current}
                        localStream={localStream}
                        controlsState={controlsState}
                        setControlState={setControlsState}
                        setConnected={setConnected}
                        remoteStream={remoteStream}
                        setRemoteStream={setRemoteStream}
                    />
            }
        </div>
    );
};
