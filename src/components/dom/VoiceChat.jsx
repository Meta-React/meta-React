import { useState, useEffect, useRef } from 'react';

const ICE_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

function RemoteAudio({ stream }) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay playsInline />;
}

export default function VoiceChat({ socket }) {
    const [inVoice, setInVoice] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [remoteStreams, setRemoteStreams] = useState({});

    const localStreamRef = useRef(null);
    const peersRef = useRef({});

    const createPeerConnection = (targetId, isInitiator) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peersRef.current[targetId] = pc;

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webrtc-ice-candidate', {
                    target: targetId,
                    candidate: event.candidate,
                });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStreams((prev) => ({
                ...prev,
                [targetId]: event.streams[0],
            }));
        };

        if (isInitiator) {
            pc.createOffer()
                .then((offer) => pc.setLocalDescription(offer))
                .then(() => {
                    socket.emit('webrtc-offer', {
                        target: targetId,
                        offer: pc.localDescription,
                    });
                })
                .catch((err) => console.error('Offer error:', err));
        }

        return pc;
    };

    const removePeer = (targetId) => {
        if (peersRef.current[targetId]) {
            peersRef.current[targetId].close();
            delete peersRef.current[targetId];
        }
        setRemoteStreams((prev) => {
            const updated = { ...prev };
            delete updated[targetId];
            return updated;
        });
    };

    useEffect(() => {
        if (!socket) return;

        const handleVoiceUsers = (users) => {
            users.forEach((userId) => {
                createPeerConnection(userId, true);
            });
        };

        const handleUserJoined = (userId) => {
            if (!peersRef.current[userId]) {
                createPeerConnection(userId, false);
            }
        };

        const handleOffer = async ({ sender, offer }) => {
            const pc = peersRef.current[sender] || createPeerConnection(sender, false);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc-answer', {
                target: sender,
                answer: pc.localDescription,
            });
        };

        const handleAnswer = async ({ sender, answer }) => {
            const pc = peersRef.current[sender];
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        };

        const handleIceCandidate = async ({ sender, candidate }) => {
            const pc = peersRef.current[sender];
            if (pc && candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        };

        const handleUserLeft = (userId) => {
            removePeer(userId);
        };

        socket.on('voice-users', handleVoiceUsers);
        socket.on('user-joined-voice', handleUserJoined);
        socket.on('webrtc-offer', handleOffer);
        socket.on('webrtc-answer', handleAnswer);
        socket.on('webrtc-ice-candidate', handleIceCandidate);
        socket.on('user-left-voice', handleUserLeft);

        return () => {
            socket.off('voice-users', handleVoiceUsers);
            socket.off('user-joined-voice', handleUserJoined);
            socket.off('webrtc-offer', handleOffer);
            socket.off('webrtc-answer', handleAnswer);
            socket.off('webrtc-ice-candidate', handleIceCandidate);
            socket.off('user-left-voice', handleUserLeft);
        };
    }, [socket]);

    const joinVoice = async () => {
        setErrorMsg('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            setInVoice(true);
            setIsMuted(false);
            socket.emit('join-voice');
        } catch (err) {
            setErrorMsg('Microphone permission denied');
        }
    };

    const leaveVoice = () => {
        socket.emit('leave-voice');
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }
        Object.keys(peersRef.current).forEach((id) => removePeer(id));
        setInVoice(false);
        setIsMuted(false);
    };

    const toggleMute = () => {
        if (!localStreamRef.current) return;
        const nextMuted = !isMuted;
        localStreamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = !nextMuted;
        });
        setIsMuted(nextMuted);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px',
                zIndex: 1000,
                fontFamily: 'sans-serif',
            }}
        >
            {!inVoice ? (
                <button
                    onClick={joinVoice}
                    style={{
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 18px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Join Voice
                </button>
            ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={toggleMute}
                        style={{
                            backgroundColor: isMuted ? '#eab308' : '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 14px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                    <button
                        onClick={leaveVoice}
                        style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 14px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        Leave Voice
                    </button>
                </div>
            )}

            {errorMsg && (
                <div
                    style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {errorMsg}
                </div>
            )}

            {Object.entries(remoteStreams).map(([id, stream]) => (
                <RemoteAudio key={id} stream={stream} />
            ))}
        </div>
    );
}