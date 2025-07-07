# Audio Transcriber & Diarizer

A basic React-based application that transcribes MP3 audio files with speaker diarization using Google's Gemini AI. Simply upload an MP3 file and get a detailed transcription with speaker labels.

## Features

- **Audio Transcription**: Convert MP3 audio files to text
- **Speaker Diarization**: Automatically identify and label different speakers
- **Real-time Processing**: Live loading indicators and error handling
- **Accessibility**: Built with ARIA labels and keyboard navigation support

## Technologies Used

- **React 19.1.0** 
- **TypeScript** 
- **Vite** 
- **Google Generative AI (@google/genai)** 


## Prerequisites

- Node.js (recommended: latest LTS version)
- Bun package manager (recommended) or npm
- Google AI API key (Gemini API access)

## Setup & Installation

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment variables:**
   Copy the environment example file and create your local environment file:
   ```bash
   cp env.local.example .env.local
   ```
   Then edit `.env.local` and add your actual Gemini API key:
   ```
   API_KEY=your_actual_gemini_api_key_here
   ```

3. **Start the development server:**
   ```bash
   bun run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to use the application


## Supported Audio Formats

- MP3 (.mp3) - Currently the only supported format
- Future versions may support additional formats

## API Integration

This application uses Google's Gemini 2.5 Flash model for audio transcription with speaker diarization. The audio file is converted to base64 format and sent to the Gemini API along with transcription instructions.

## Build for Production

```bash
bun run build
```

The built files will be in the `dist` directory.

## Author

**Safwan Erooth**  
Email: safwan[@]tridz[.]com

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
