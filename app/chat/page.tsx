//app/chat/page.tsx
'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useChild } from '@/lib/context/ChildContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chats = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string, audioUrl?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { childId, childName, wishList, setChildData } = useChild();

  // Start voice recognition (transcription)
  const handleStartVoiceMessage = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, interimResults: true });
  };

  // Stop voice recognition and send message (send only transcript as text)
  const handleStopVoiceMessage = () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      handleSendVoiceMessage(transcript); // Send the transcription (text) instead of raw audio
    }
  };

  // Handle text message send (send text directly)
  const handleSendTextMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'child', text: messageText }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, childName, wishList }),
      });

      const data = await res.json();

      if (res.ok) {
        handleGenerateAudioResponse(data.response, data.response);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'santa', text: "Sorry, I didn't get that. Can you try again?" },
        ]);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'santa', text: 'Something went wrong, please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending voice message (transcription only, no audio sent)
  const handleSendVoiceMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'child', text: messageText }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, childName, wishList }),
      });

      const data = await res.json();

      if (res.ok) {
        handleGenerateAudioResponse(data.response, data.response);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'santa', text: "Sorry, I didn't get that. Can you try again?" },
        ]);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'santa', text: 'Something went wrong, please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Generate Santa's audio response (response from backend)
  const handleGenerateAudioResponse = async (text: string, fullResponseText: string) => {
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        setMessages((prev) => [
          ...prev,
          { sender: 'santa', text: fullResponseText, audioUrl },
        ]);
      } else {
        console.error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error generating audio response:', error);
    }
  };

  // Start audio recording using MediaRecorder API
  const handleStartRecording = async () => {
    if (navigator.mediaDevices) {
      try {
        // Start SpeechRecognition (transcription)
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, interimResults: true });

        // Start MediaRecorder (audio recording)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    }
  };

  // Stop the audio recording and speech-to-text
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      SpeechRecognition.stopListening();
      setIsRecording(false);
    }
  };

  // Send the recorded audio message along with transcription (text only)
  const handleSendAudioMessage = async () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      setMessages((prev) => [
        ...prev,
        { sender: 'child', text: transcript, audioUrl }, // Include transcript with the audio (but only text is sent to backend)
      ]);
      setAudioBlob(null);

      setLoading(true);

      try {
        // Only send the transcript (text) to the backend
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript, childName, wishList }),
        });

        const data = await res.json();

        if (res.ok) {
          handleGenerateAudioResponse(data.response, data.response);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: 'santa', text: "Sorry, I didn't get that. Can you try again?" },
          ]);
        }
      } catch (error) {
        console.error('Error sending audio:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'santa', text: 'Something went wrong, please try again.' },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch child data based on childId from URL
  useEffect(() => {
    const childIdFromUrl = searchParams.get('childId');

    if (!childIdFromUrl || !childId) {
      router.push('/register');
      return;
    }

    const fetchChildData = async () => {
      if (!childName || !wishList) {
        try {
          const res = await fetch(`/api/child-data?childId=${childIdFromUrl}`);
          const data = await res.json();

          if (res.ok) {
            setChildData(data.childId, data.childName, data.wishList);
          } else {
            router.push('/register');
          }
        } catch (error) {
          console.log(error);
          router.push('/register');
        }
      }
    };

    fetchChildData();
  }, [searchParams, router, childId, childName, wishList, setChildData]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a1c3f] via-[#063d5e] to-[#003b5c] text-white py-24 px-5 sm-p-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-red-600 mb-4 sm:mb-6 font-[family-name:var(--font-santa-mono)]">
        Chat with Father Christmas
      </h2>

      <div className="max-w-full sm:max-w-xl mx-auto sm:p-3 md:p-4 rounded-lg shadow-md relative"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#003b5c] opacity-60 rounded-lg"></div>

        <div className="relative p-4 sm:p-6 h-96 overflow-y-auto rounded-lg mb-4 bg-opacity-80 z-10">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'santa' ? 'text-green-600' : 'text-red-600'} flex items-start space-x-3`}>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                {msg.sender === 'santa' ? (
                  <Image src="/images/santa2.png" alt="Santa" width={40} height={40} />
                ) : (
                  <Image src="/images/user.png" alt={childName || "User"} width={40} height={40} />
                )}
              </div>

              <div className="flex flex-col justify-start space-y-2">
                <p className="text-white font-bold font-[family-name:var(--font-santa-mono)]">
                  <strong>{msg.sender === 'santa' ? 'Santa Clause' : childName}:</strong>
                </p>
                <div className={`max-w-xs sm:max-w-lg p-3 rounded-lg ${msg.sender === 'santa' ? 'border border-white text-green-600' : 'border border-white text-red-600'} shadow-md`}>
                  <p className="text-white">{msg.text}</p>
                  {msg.audioUrl && (
                    <audio controls className="mt-2">
                      <source src={msg.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSendTextMessage(message); }} className="relative flex flex-row items-center bg-white bg-opacity-20 p-4 rounded-lg z-10">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="p-3 border border-red-600 rounded-lg mr-2 text-white bg-transparent w-full"
          />
          <button type="submit" disabled={loading} className={`btn-custom p-3 text-lg sm:text-xl transition duration-300 ${loading ? 'opacity-50 font-[family-name:var(--font-santa-mono)] cursor-not-allowed' : ''}`}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>

        {/* Button Container */}
        <div className="mt-4 flex justify-between items-center">
          {/* Voice Message Controls */}
          <div className="flex gap-2 m-2">
            <button onClick={handleStartVoiceMessage} disabled={listening} className="btn-custom w-1/8 flex items-center justify-center p-3 rounded-full bg-red-600 text-white">
              {listening ? 'Listening...' : (
                <i className="fas fa-headset"></i>
              )}
            </button>

            {listening && (
              <button onClick={handleStopVoiceMessage} className="btn-custom w-1/8 flex items-center justify-center p-3 rounded-full bg-green-600 text-white">
                <i className="fas fa-stop"></i>
              </button>
            )}
          </div>

          {/* Audio Recording Controls */}
          <div className="flex gap-2">
            <button onClick={handleStartRecording} disabled={isRecording} className="btn-custom w-1/8 flex items-center justify-center p-3 rounded-full bg-yellow-500 text-white">
              {isRecording ? 'Recording...' : (
                <i className="fas fa-microphone"></i>
              )}
            </button>
            <button onClick={handleStopRecording} disabled={!isRecording} className="btn-custom w-1/8 flex items-center justify-center p-3 rounded-full bg-red-600 text-white">
              <i className="fas fa-stop"></i>
            </button>

            {/* Send Audio Button */}
            {audioBlob && (
              <button onClick={handleSendAudioMessage} className="btn-custom w-1/8 flex items-center justify-center p-3 rounded-full bg-blue-600 text-white">
                <i className="fas fa-paper-plane"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



const Chat = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chats />
    </Suspense>
  );
};

export default Chat;
