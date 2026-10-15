import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, 
  MessageSquare, FileText, Share2, Shield, Heart, 
  Activity, Send, Pill, Copy, Check, ExternalLink,
  Users, Sparkles, RefreshCw, Volume2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TelehealthRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mode: 'jitsi' (Multi-device live video conference) | 'hardware' (Direct webcam stream & hardware diagnostic)
  const [streamMode, setStreamMode] = useState('jitsi');
  
  // Hardware Media Stream state
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [cameraError, setCameraError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Tabs & Consultation state
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'chat' | 'vitals'
  const [heartRate, setHeartRate] = useState(74);
  const [spo2, setSpo2] = useState(98);
  const [callDuration, setCallDuration] = useState(120); // seconds
  const [rxGenerated, setRxGenerated] = useState(false);

  // Doctor notes & chat state
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient presenting for routine cardiovascular review. Reported blood pressure: 125/82 mmHg. Pulse regular. Continuing current pharmacotherapy protocol.'
  );
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Sarah Jenkins', time: '10:02 AM', text: 'Welcome to your MedClinic Telehealth consultation! Can you see and hear me clearly?' },
    { sender: user?.name || 'Ade Johnson', time: '10:03 AM', text: 'Yes Doctor, the connection is crisp and clear.' },
    { sender: 'Dr. Sarah Jenkins', time: '10:04 AM', text: 'Excellent. Let us review your medication compliance and current vitals.' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const localVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Unique Room ID for multi-device live calling
  const roomName = `medclinic-telehealth-room-2026`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  // Start Hardware Camera Stream
  const startCameraStream = async () => {
    try {
      setCameraError('');
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Audio Level Analyzer
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const checkAudio = () => {
          if (!analyserRef.current) return;
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(checkAudio);
        };
        checkAudio();
      } catch (e) {
        console.warn('Audio analyzer not supported in current environment', e);
      }
    } catch (err) {
      console.error('Camera/Mic permission error:', err);
      setCameraError('Camera or microphone permission was denied or not found on this device. Please grant permission in your browser address bar.');
    }
  };

  const stopCameraStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  useEffect(() => {
    if (streamMode === 'hardware') {
      startCameraStream();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [streamMode]);

  // Call timer and vitals simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
      if (Math.random() > 0.6) {
        setHeartRate(prev => Math.min(84, Math.max(68, prev + (Math.random() > 0.5 ? 1 : -1))));
        setSpo2(prev => Math.min(100, Math.max(97, prev + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle Live Hardware Mute
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  // Toggle Live Hardware Video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  // Live Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
          }
        };
      } catch (err) {
        console.warn('Screen share canceled or not permitted', err);
      }
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(jitsiUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: user?.name || 'Patient Ade',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: newMessage
      }
    ]);
    setNewMessage('');
  };

  const handleSaveRx = () => {
    setRxGenerated(true);
    alert('Digital Prescription authorized and linked to Your Health Pharmacy dispensary queue in Onitsha!');
  };

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      
      {/* Top Banner Status Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-white">Live Clinical Consultation Suite</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Shield size={11} />
                <span>256-BIT ENCRYPTED</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Room ID: <span className="font-mono text-slate-300">#MED-2026-RX</span> &bull; Provider: Dr. Sarah Jenkins / Pharm. Chinedu
            </p>
          </div>
        </div>

        {/* Live Controls & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher Buttons */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setStreamMode('jitsi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                streamMode === 'jitsi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Multi-Device Room</span>
            </button>
            <button
              onClick={() => setStreamMode('hardware')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                streamMode === 'hardware'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video size={14} />
              <span>Direct Camera Feed</span>
            </button>
          </div>

          {/* Copy Invite Link */}
          <button
            onClick={copyInviteLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Copy call link to invite patient on their phone"
          >
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Invite Patient'}</span>
          </button>

          {/* Vitals Ticker */}
          <div className="flex items-center gap-3 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-rose-500 animate-pulse fill-rose-500" />
              <span>{heartRate} BPM</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <Activity size={14} />
              <span>SpO2 {spo2}%</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{formatDuration(callDuration)}</span>
          </div>
        </div>
      </div>

      {/* Main Video & Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[580px]">
        
        {/* Left Column: Video Consultation Area (8 Columns on desktop) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-slate-800">
          
          {/* STREAM VIEWPORT */}
          {streamMode === 'jitsi' ? (
            /* Multi-Party Live Encrypted Jitsi Video Room */
            <div className="relative w-full h-[520px] lg:h-full bg-slate-950 flex flex-col">
              <iframe
                src={jitsiUrl}
                title="Live Medical Telehealth Room"
                allow="camera; microphone; display-capture; autoplay; clipboard-write"
                className="w-full h-full border-0 rounded-2xl"
              />
              
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center gap-2 pointer-events-none text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Encrypted HD Video Room Active</span>
              </div>
            </div>
          ) : (
            /* Direct Browser Hardware Camera Stream */
            <div className="relative w-full h-[520px] lg:h-full bg-slate-950 flex flex-col justify-between p-4">
              
              {/* Top Stream Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center gap-2 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Direct WebRTC Hardware Feed</span>
                </div>

                {/* Real-time Audio Visualizer */}
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center gap-2 text-xs">
                  <Volume2 size={14} className={audioLevel > 5 ? 'text-emerald-400 animate-pulse' : 'text-slate-400'} />
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-75"
                      style={{ width: `${Math.min(100, audioLevel * 2)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Main Local Video Screen */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                {cameraError ? (
                  <div className="max-w-md p-6 bg-slate-800 rounded-2xl text-center text-slate-300 space-y-3 mx-4 border border-rose-500/30">
                    <AlertCircle size={36} className="text-rose-400 mx-auto" />
                    <h3 className="font-bold text-white text-sm">Camera Permission Required</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
                    <button
                      onClick={startCameraStream}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Retry Permission
                    </button>
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Action Bar for Hardware Controls */}
              <div className="relative z-10 flex items-center justify-center gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 max-w-md mx-auto w-full mt-auto">
                <button 
                  onClick={toggleMute}
                  className={`p-3 rounded-xl transition-colors cursor-pointer ${isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button 
                  onClick={toggleVideo}
                  className={`p-3 rounded-xl transition-colors cursor-pointer ${isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                  title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>

                <button 
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-xl transition-colors cursor-pointer ${isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                  title="Share your desktop screen"
                >
                  <Share2 size={18} />
                </button>

                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  title="End Consultation"
                >
                  <PhoneOff size={18} />
                  <span>Leave Room</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Doctor Clinical Notepad & In-Call Messages (4 Columns on desktop) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 gap-1 bg-slate-50/50 dark:bg-slate-850">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'notes' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <FileText size={14} />
              <span>Clinical Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'chat' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <MessageSquare size={14} />
              <span>Live Chat ({chatMessages.length})</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
            {activeTab === 'notes' ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Physician Assessment & Observations</span>
                  <textarea
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    rows={7}
                    placeholder="Enter diagnostic notes, prescription recommendations..."
                    className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                  <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <div className="flex items-center gap-1.5">
                      <Pill size={15} />
                      <span>Digital Rx & Pharmacy Link</span>
                    </div>
                    {rxGenerated && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">
                        ✓ Dispatched
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    &bull; <strong>Norvasc (Amlodipine 10mg)</strong> — 1 tab daily (30 days)<br />
                    &bull; <strong>Omega-3 Fish Oil 1000mg</strong> — 1 capsule twice daily
                  </p>
                </div>

                <button 
                  onClick={handleSaveRx}
                  className="mt-auto w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Pill size={14} />
                  <span>Save & Authorize Digital Rx</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender.includes('Ade') || msg.sender === user?.name ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-slate-500">{msg.sender}</span>
                        <span className="text-[9px] text-slate-400">{msg.time}</span>
                      </div>
                      <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] ${msg.sender.includes('Ade') || msg.sender === user?.name ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type in-call message..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-primary text-slate-800 dark:text-white"
                  />
                  <button type="submit" className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer">
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
