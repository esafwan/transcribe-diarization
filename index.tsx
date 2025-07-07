import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Helper function to convert file to base64 ---
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result is a data URL: "data:audio/mpeg;base64,..."
            // We only need the base64 part, so we split on the comma and take the second part.
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

const App = () => {
    const [file, setFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'audio/mpeg') {
                 setError('Please select a valid MP3 file.');
                 setFile(null);
            } else {
                setFile(selectedFile);
                setTranscription('');
                setError('');
            }
        }
    };

    const handleTranscribe = useCallback(async () => {
        if (!file) {
            setError('Please select an MP3 file first.');
            return;
        }

        if (!process.env.API_KEY) {
            setError('API key is not configured. Please set the API_KEY environment variable.');
            return;
        }

        setIsLoading(true);
        setError('');
        setTranscription('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Audio = await fileToBase64(file);

            const audioPart = {
                inlineData: {
                    mimeType: 'audio/mpeg',
                    data: base64Audio,
                },
            };

            const textPart = {
                text: 'Transcribe this audio with speaker diarization.',
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: { parts: [audioPart, textPart] },
            });

            setTranscription(response.text);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to transcribe audio: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    return (
        <>
            <style>
                {`
                    :root {
                        --primary-color: #4285F4;
                        --primary-hover-color: #357ae8;
                        --background-color: #f0f2f5;
                        --container-bg-color: #ffffff;
                        --text-color: #3c4043;
                        --secondary-text-color: #5f6368;
                        --border-color: #dadce0;
                        --error-color: #d93025;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background-color: var(--background-color);
                        color: var(--text-color);
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        padding: 1rem;
                        box-sizing: border-box;
                    }

                    .container {
                        background-color: var(--container-bg-color);
                        border-radius: 8px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        padding: 2rem 2.5rem;
                        width: 100%;
                        max-width: 600px;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    header h1 {
                        margin: 0 0 0.5rem 0;
                        font-size: 2rem;
                        color: var(--text-color);
                    }

                    header p {
                        margin: 0;
                        color: var(--secondary-text-color);
                    }
                    
                    .upload-section {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        align-items: center;
                    }
                    
                    input[type="file"] {
                        display: none;
                    }

                    .file-label {
                        border: 2px dashed var(--border-color);
                        border-radius: 8px;
                        padding: 2rem;
                        width: 100%;
                        box-sizing: border-box;
                        cursor: pointer;
                        transition: background-color 0.2s ease, border-color 0.2s ease;
                    }
                    
                    .file-label:hover {
                        background-color: #f8f9fa;
                        border-color: var(--primary-color);
                    }

                    button {
                        background-color: var(--primary-color);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 0.75rem 1.5rem;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s ease, box-shadow 0.2s ease;
                        width: 50%;
                    }

                    button:hover:not(:disabled) {
                        background-color: var(--primary-hover-color);
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    
                    button:disabled {
                        background-color: #bdbdbd;
                        cursor: not-allowed;
                    }
                    
                    .error-message {
                        color: var(--error-color);
                        background-color: #fce8e6;
                        border: 1px solid var(--error-color);
                        border-radius: 4px;
                        padding: 0.75rem;
                        text-align: center;
                    }

                    .loader-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                        margin-top: 1rem;
                        color: var(--secondary-text-color);
                    }

                    .loader {
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid var(--primary-color);
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .transcription-result {
                        margin-top: 1rem;
                        text-align: left;
                        width: 100%;
                    }

                    .transcription-result h2 {
                        margin-bottom: 0.5rem;
                        font-size: 1.25rem;
                    }
                    
                    .transcription-result textarea {
                        width: 100%;
                        box-sizing: border-box;
                        min-height: 200px;
                        border: 1px solid var(--border-color);
                        border-radius: 4px;
                        padding: 0.75rem;
                        font-size: 1rem;
                        font-family: monospace;
                        resize: vertical;
                        background-color: #f8f9fa;
                    }

                    footer {
                        margin-top: 1rem;
                        font-size: 0.875rem;
                        color: var(--secondary-text-color);
                    }
                `}
            </style>
            <div className="container">
                <header>
                    <h1>Audio Transcriber & Diarizer</h1>
                    <p>Upload an MP3 file to get a transcription with speaker labels.</p>
                </header>
                <main>
                    <div className="upload-section">
                        <label htmlFor="audio-upload" className="file-label" aria-label="Upload an MP3 file">
                            {file ? file.name : 'Choose an MP3 file'}
                        </label>
                        <input
                            id="audio-upload"
                            type="file"
                            accept="audio/mpeg"
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                        <button onClick={handleTranscribe} disabled={!file || isLoading} aria-live="polite">
                            {isLoading ? 'Transcribing...' : 'Transcribe'}
                        </button>
                    </div>
                    {error && <div role="alert" className="error-message">{error}</div>}
                    {isLoading && (
                        <div className="loader-container" aria-label="Transcription in progress">
                            <div className="loader"></div>
                            <p>Processing audio, this may take a moment...</p>
                        </div>
                    )}
                    {transcription && (
                        <div className="transcription-result">
                            <h2>Transcription:</h2>
                            <textarea readOnly value={transcription} aria-label="Transcription result"></textarea>
                        </div>
                    )}
                </main>
                <footer>
                    <p>Powered by Gemini</p>
                </footer>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);