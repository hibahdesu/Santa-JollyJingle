// types/global.d.ts
declare global {
  const mongoose: {
    conn: import("mongoose").Connection | null;
    promise: Promise<import("mongoose").Connection> | null;
  } | undefined;


  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }

  interface SpeechRecognitionStatic {
    new (): SpeechRecognition;
  }

  interface SpeechRecognition {
    start(): void;
    stop(): void;
    abort(): void;
    lang: string;
    interimResults: boolean;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    onstart: ((this: SpeechRecognition) => void) | null;
    onspeechstart: ((this: SpeechRecognition) => void) | null;
    onspeechend: ((this: SpeechRecognition) => void) | null;
    onend: ((this: SpeechRecognition) => void) | null;
  }

  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }

  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
}

// Ensure the file is treated as a module
export {};
