'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useChild } from '@/lib/context/ChildContext'; 

interface SpeechRecognitionExtended extends SpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

const SantaCall = () => {
  const { childId, childName, wishList } = useChild(); 
  console.log('chileId in SantaCall:', childId);

  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<{ sender: 'child' | 'santa'; text: string }[]>([]);
  console.log('object:', conversation);
  const recognitionRef = useRef<SpeechRecognitionExtended | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isWaitingForSanta, setIsWaitingForSanta] = useState(false);
  const [callDuration, setCallDuration] = useState(0); 
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const [isHangUpInProgress, setIsHangUpInProgress] = useState(false);

  useEffect(() => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    return () => {
      stopCallDuration();
      stopVoiceRecognition();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass() as SpeechRecognitionExtended;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        if (event.results[event.results.length - 1].isFinal) {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          console.log('User said:', transcript);

          if (transcript) {
            setConversation((prev) => [...prev, { sender: 'child', text: transcript }]);
            if (!isWaitingForSanta) {
              await sendMessageToSanta(transcript);
            }
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);

        // If hang-up is in progress, ignore the error
        if (isHangUpInProgress) {
          console.log('Hang up in progress, ignoring speech recognition error.');
          return;
        }

        if (event.error === 'no-speech' && isRecording) {
          console.log('No speech detected, restarting recognition...');
          recognition.start(); 
        }
      };

      recognition.onend = () => {
        // If the hang-up is in progress, prevent any restarts
        if (!isHangUpInProgress && isRecording) {
          console.log('Speech recognition ended, restarting...');
          recognition.start(); 
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.error('SpeechRecognition is not supported in this browser.');
    }
  };


  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isRecording) {
      console.log('Starting voice recognition...');
      recognitionRef.current.start();
      setIsRecording(true);
      startCallDuration();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isRecording) {
      console.log('Stopping voice recognition...');
      recognitionRef.current.stop(); 
      setIsRecording(false);
      stopCallDuration();
    }
  };

  const startCallDuration = () => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000); 
    setIntervalRef(interval);
  };

  const stopCallDuration = () => {
    if (intervalRef) {
      clearInterval(intervalRef);
      setIntervalRef(null);
    }
  };

  const hangUp = () => {
    console.log('Hanging up...');
    setIsHangUpInProgress(true); 
    stopVoiceRecognition(); 
    stopCallDuration(); 
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setConversation([]); 
    setIsRecording(false); 
    setCallDuration(0); 


    setTimeout(() => {
      setIsHangUpInProgress(false);
    }, 500); 
  };

  const sendMessageToSanta = async (message: string) => {
    try {
      setIsWaitingForSanta(true);

      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          childName,     
          wishList,     
        }),
      });

      if (!response.ok) throw new Error("Failed to get Santa's response");

      const { response: santaReply } = await response.json();
      console.log('Santa says:', santaReply);

      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: santaReply }),
      });

      if (!audioResponse.ok) throw new Error('Failed to fetch Santa\'s audio response');

      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audioElement = new Audio(audioUrl);
      audioElement.play();

      audioRef.current = audioElement;

      setConversation((prev) => [...prev, { sender: 'santa', text: santaReply }]);

      pauseVoiceRecognition();

      audioElement.onended = () => {
        setIsWaitingForSanta(false);
        resumeVoiceRecognition();
      };

      audioElement.onerror = () => {
        console.error('Error playing audio');
        setIsWaitingForSanta(false);
        resumeVoiceRecognition();
      };
    } catch (error) {
      console.error('Error during conversation:', error);
      setIsWaitingForSanta(false);
    }
  };

  const pauseVoiceRecognition = () => {
    if (recognitionRef.current && isRecording) {
      console.log('Pausing voice recognition...');
      recognitionRef.current.stop();
    }
  };

  const resumeVoiceRecognition = () => {
    if (recognitionRef.current && !isRecording) {
      console.log('Resuming voice recognition...');
      recognitionRef.current.start();
    }
  };

  const isButtonDisabled = !childName || !wishList;

  return (
    <div className="call-page h-full py-24 flex flex-col items-center justify-center gap-4">
      <div className="relative lg:w-1/2 w-full max-w-[200px] sm:max-w-[150px] mt-8 lg:mt-0 overflow-hidden border-2 rounded-full">
        <Image
          src="/images/santa3.png"
          alt="Santa Claus"
          layout="responsive"
          width={100}
          height={100}
          objectFit="cover"
        />
      </div>
      <h3 className='text-white font-[family-name:var(--font-santa-mono)]'>Santa Claus</h3>

      <div className="call-info">
        <p>{Math.floor(callDuration / 60)}:{callDuration % 60 < 10 ? `0${callDuration % 60}` : callDuration % 60}</p>
      </div>

      <button
        onClick={isRecording ? hangUp : startVoiceRecognition}
        className={`p-5 rounded-full hover:bg-opacity-80 border-transparent hover:border-white ${isRecording ? 'bg-red-600' : 'bg-green-600'}`}
        disabled={isButtonDisabled} 
      >
        {isRecording ? '🛑' : '📞'}
      </button>
      
      {isButtonDisabled && (
        <p className="text-red-600 text-center mt-4">Please complete the registration before starting the call!</p>
      )}
    </div>
  );
};

export default SantaCall;
