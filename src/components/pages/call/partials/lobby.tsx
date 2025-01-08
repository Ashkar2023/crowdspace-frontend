import { Button } from "@nextui-org/react";
import { Dispatch, FC, MutableRefObject, ReactNode, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { LuLoader, LuMic, LuMicOff, LuVideo, LuVideoOff, LuSettings } from "react-icons/lu";
import { ControlState } from "../call.page";
import { SocketContext } from "~/context/socketContext";
import { useParams, useSearchParams } from "react-router-dom";
import { SocketEvents } from "~constants/socket.events";
import { callMetadata } from "~types/context/socketContext.types";
import toast from "react-hot-toast";
import { useAppSelector } from "~hooks/useReduxHooks";
import { object } from "zod";
import { peerConfig } from "~config/RTCpeer.config";

type Props = {
    localStream: MediaStream | null;
    controlsState: ControlState;
    setControlState: Dispatch<SetStateAction<ControlState>>;
    setConnected: Dispatch<SetStateAction<boolean>>;
    setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>
    rtcPeerConnection: RTCPeerConnection | null
};

//LOBBY 
const Lobby: FC<Props> = ({
    localStream, controlsState,
    rtcPeerConnection: pc,
    setControlState, setConnected, setRemoteStream
}) => {
    const stateUserId = useAppSelector(state => state.user._id);
    const videoRef = useRef<HTMLVideoElement>(null);
    let timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const [isJoining, setIsJoining] = useState(false);
    const { Socket } = useContext(SocketContext);
    const [searchParams] = useSearchParams();
    const { chat_id } = useParams()

    let iceQueue: RTCIceCandidateInit[] = [];



    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        console.log("Lobby rerendered")
    })

    // DELETE ---------------
    useEffect(() => {
        console.log("PEER", localStream)
    }, [localStream]);
    // DELETE ---------------

    const callDeclinedHandler = (data: string) => {

        timeOutRef.current && clearTimeout(timeOutRef.current)

        toast.error(data, {
            duration: 2000,
            style: {
                background: "var(--app-secondary)",
                color: "var(--app-text-primary)",
                border: "1px solid var(--app-tertiary)"
            }
        })
        setIsJoining(false)
    }


    const createCallerPeer = async () => {
        setIsJoining(true);
        console.log("calleR");

        console.log("pc was ", pc);
        if (!pc) {
            pc = new RTCPeerConnection(peerConfig);
        }
        console.log("pc is ", pc);

        pc.ontrack = (event) => {
            const [remoteStream] = event.streams;

            console.log(remoteStream);

            if (remoteStream) {
                setRemoteStream(remoteStream)
            }
        };

        pc.addEventListener("icegatheringstatechange", (e) => {
            console.log("ICE gathering state changed:", pc?.iceGatheringState);
        });

        console.log("caller stream", localStream)
        localStream?.getTracks().forEach((track) => {
            console.log("track&stream", track, "\n", localStream)
            return pc?.addTrack(track, localStream)
        });

        pc.onconnectionstatechange = (e) => {
            console.log("connectionstate", e)
            if (pc?.connectionState === "connected") {
                setConnected(true)
            }
        }

        pc.onicecandidate = (ev) => {
            console.log(ev.candidate);

            if (ev.candidate) {
                Socket?.emit(SocketEvents.rtc_ice_candidates, { candidate: ev.candidate, roomId: chat_id });
            }
        }


        const offer: RTCLocalSessionDescriptionInit = await pc.createOffer();
        await pc.setLocalDescription(offer);

        Socket?.emit(SocketEvents.rtc_offer_send, { roomId: chat_id, offer });

        console.log(pc.signalingState);

        setIsJoining(false);
    };

    const createReceiverPeer = async (callData: { roomId: string, offer: any }) => {

        console.log("receiver pc was ", pc);
        if (!pc) {
            pc = new RTCPeerConnection(peerConfig);
        }
        console.log("receiver pc is ", pc);


        pc.ontrack = (event) => {
            const [remoteStream] = event.streams;
            console.log(remoteStream.id)

            if (remoteStream) {
                setRemoteStream(remoteStream)
            }
        };

        pc.onconnectionstatechange = (e) => {
            console.log(e)
            if (pc?.connectionState === "connected") {
                setConnected(true)
            }
        }

        console.log("receiver stream", localStream)
        localStream?.getTracks().forEach((track) => {
            console.log("track&stream", track, "\n", localStream)
            return pc?.addTrack(track, localStream)
        });

        const remoteDescription = new RTCSessionDescription(callData.offer);

        try {
            await pc.setRemoteDescription(remoteDescription);

            while (iceQueue.length) {
                const candidate = iceQueue.shift();

                try {
                    await pc.addIceCandidate(candidate);
                } catch (error) {
                    console.log("from CRP icequeue", (error as Error).message)

                }
            }
        } catch (error) {
            console.error(error);
        }

        pc.onicegatheringstatechange = e => {
            console.log("icegatheringstatechange", e);
        }

        pc.onicecandidate = ev => {
            console.log(ev.candidate)
            if (ev.candidate) {
                Socket?.emit(SocketEvents.rtc_ice_candidates, { candidate: ev.candidate, roomId: callData.roomId });
            }
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        Socket?.emit(SocketEvents.rtc_answer_send, { answer: answer, roomId: chat_id })
    };

    const answerReceiveHandler = async (rtcData: { answer: any, roomId: string }) => {
        try {
            await pc?.setRemoteDescription(new RTCSessionDescription(rtcData.answer));
        } catch (error) {
            console.log((error as Error).message)
        }
    }

    const userJoinHandler = ({ roomId, receiverId }: callMetadata, cb: Function) => {
        cb({
            status: true
        });
        timeOutRef.current && clearTimeout(timeOutRef.current)
        createCallerPeer();
    };

    const handleIceCandidatesExchange = async (data: { candidate: RTCIceCandidateInit }) => {
        try {
            if (pc?.remoteDescription) {
                console.log("In", data.candidate)
                await pc?.addIceCandidate(new RTCIceCandidate(data.candidate));

            } else {
                iceQueue.push(new RTCIceCandidate(data.candidate));
            }
        } catch (error) {
            console.log("error from handleIceCandidate", (error as Error).message);
        }
    };

    const handleUserJoinedLobby = ({ joineeId }: { joineeId: string }, cb: Function) => {
        cb({
            status: true
        });

        console.log("lobby joineeId", joineeId);
    }

    useEffect(() => {
        Socket?.on(SocketEvents.call_user_declined, callDeclinedHandler);
        Socket?.on(SocketEvents.call_user_joined, userJoinHandler);
        Socket?.on(SocketEvents.rtc_offer_receive, createReceiverPeer);
        Socket?.on(SocketEvents.rtc_answer_receive, answerReceiveHandler);
        Socket?.on(SocketEvents.rtc_ice_candidates, handleIceCandidatesExchange)

        if (stateUserId === searchParams.get("receiver")) {
            Socket?.emit(SocketEvents.call_user_join_lobby, { joineeId: stateUserId, roomId: chat_id })
        } else {
            Socket?.on(SocketEvents.call_user_joined_lobby, handleUserJoinedLobby)
        }

        console.log("socket handlers set, ", "receiver :", stateUserId === searchParams.get("receiver"))

        return () => {
            Socket?.off(SocketEvents.call_user_declined, callDeclinedHandler)
            Socket?.off(SocketEvents.call_user_joined, userJoinHandler)
            Socket?.off(SocketEvents.rtc_offer_receive, createReceiverPeer);
            Socket?.off(SocketEvents.rtc_answer_receive, answerReceiveHandler);
            Socket?.off(SocketEvents.rtc_ice_candidates, handleIceCandidatesExchange)
            Socket?.off(SocketEvents.call_user_joined_lobby, handleUserJoinedLobby)
            console.log("socket handlers removed")

            timeOutRef.current && clearTimeout(timeOutRef.current);
            intervalRef.current && clearInterval(intervalRef.current);
        }
    }, [Socket])


    return (
        <div className="rounded-lg shadow-[0px_20px_80px_20px_rgba(0,132,255,0.2)]">
            <video
                ref={videoRef}
                autoPlay
                muted={!controlsState.mic}
                className="mobile:h-[300px] aspect-video object-cover mobile:min-w-56 rounded-md rounded-b-md m-2 mb-0"
            />
            <div className="flex gap-2 p-2">
                <div className="flex flex-grow justify-center items-center space-x-1 py-2 rounded-lg bg-app-tertiary">
                    <Button
                        isIconOnly
                        className={`$${controlsState.mic ? "bg-app-t-primary" : "bg-red-500"} text-app-primary`}
                        onClick={() =>
                            setControlState((prev) => ({ ...prev, mic: !prev.mic }))
                        }
                    >
                        {controlsState.mic ? <LuMic size={18} /> : <LuMicOff size={18} />}
                    </Button>
                    <Button
                        isIconOnly
                        className={`$${controlsState.camera ? "bg-app-t-primary" : "bg-red-500"} text-app-primary`}
                        onClick={() =>
                            setControlState((prev) => ({ ...prev, camera: !prev.camera }))
                        }
                    >
                        {controlsState.camera ? <LuVideo size={18} /> : <LuVideoOff size={18} />}
                    </Button>
                    <Button
                        isIconOnly
                        className="bg-app-t-primary text-app-primary"
                        aria-label="Open settings"
                    >
                        <LuSettings size={18} />
                    </Button>
                </div>
                <Button
                    className="min-w-52 h-auto bg-app-accent text-white font-semibold text-base"
                    disabled={isJoining}
                    radius="sm"
                    onClick={(e) => {

                        Socket?.emit(SocketEvents.call_create, {
                            roomId: chat_id,
                            receiverId: searchParams.get("receiver")
                        } as callMetadata)

                        timeOutRef.current = setTimeout(() => {
                            setIsJoining(false);
                            toast.error("call timed out", {
                                duration: 2000,
                                style: {
                                    background: "var(--app-secondary)",
                                    color: "var(--app-text-primary)",
                                    border: "1px solid var(--app-tertiary)"
                                }
                            })
                        }, 30 * 1000);

                        setIsJoining(true)
                    }}
                >
                    {isJoining ? (
                        <LuLoader size={20} color="white" className="animate-spin" />
                    ) : (
                        "Join"
                    )}
                </Button>
                <Button
                    onClick={async (e) => {
                        try {
                            const response = await Socket?.timeout(2000).emitWithAck(SocketEvents.call_join, chat_id);
                            console.log(response)
                        } catch (error) {
                            console.log((error as Error).message)
                        }
                    }}
                >callee join</Button>
            </div>
        </div>
    );
};

export default Lobby;