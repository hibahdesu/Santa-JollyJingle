declare module 'react-speech-recognition' {
    export interface SpeechRecognitionOptions {
      continuous?: boolean;
      interimResults?: boolean;
      language?: string;
    }
  
    export interface SpeechRecognition {
      startListening: (options?: SpeechRecognitionOptions) => Promise<void>;
      stopListening: () => Promise<void>;
      abortListening: () => Promise<void>;
    }
  
    export interface SpeechRecognitionProps {
      transcript: string;
      listening: boolean;
      browserSupportsSpeechRecognition: boolean;
      isMicrophoneAvailable: boolean;
      resetTranscript: () => void;
    }
  
    export const useSpeechRecognition: () => SpeechRecognitionProps;
    const SpeechRecognition: SpeechRecognition;
    export default SpeechRecognition;
  }
  