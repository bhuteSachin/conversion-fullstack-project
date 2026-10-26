interface SpeechRecognitionAlternativeLike {
    transcript: string;
}

interface SpeechRecognitionResultLike {
    readonly [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
    readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike extends Event {
    readonly error: string;
}

interface SpeechRecognitionLike {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: ((this: SpeechRecognitionLike, event: Event) => void) | null;
    onerror: ((this: SpeechRecognitionLike, event: SpeechRecognitionErrorEventLike) => void) | null;
    onresult: ((this: SpeechRecognitionLike, event: SpeechRecognitionEventLike) => void) | null;
    onstart: ((this: SpeechRecognitionLike, event: Event) => void) | null;
    start(): void;
    stop(): void;
}

interface SpeechRecognitionConstructor {
    new (): SpeechRecognitionLike;
}

interface RazorpayResponseLike {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayOptionsLike {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler(response: RazorpayResponseLike): void | Promise<void>;
    prefill: { email: string };
    theme: { color: string };
    modal: { ondismiss(): void };
}

interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    Razorpay?: new (options: RazorpayOptionsLike) => { open(): void };
}
