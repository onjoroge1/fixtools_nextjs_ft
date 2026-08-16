import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function encodeWav(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const frames = audioBuffer.length;
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + frames * blockAlign);
  const view = new DataView(buffer);
  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + frames * blockAlign, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, frames * blockAlign, true);

  let offset = 44;
  for (let i = 0; i < frames; i += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([view], { type: 'audio/wav' });
}

export default function AudioReverser() {
  const [fileName, setFileName] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [status, setStatus] = useState('Choose an audio file to reverse it locally in your browser.');
  const currentUrl = useRef('');

  useEffect(() => () => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
  }, []);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus('Processing audio…');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();
      const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
      const reversed = context.createBuffer(decoded.numberOfChannels, decoded.length, decoded.sampleRate);
      for (let channel = 0; channel < decoded.numberOfChannels; channel += 1) {
        const source = decoded.getChannelData(channel);
        const target = reversed.getChannelData(channel);
        for (let i = 0; i < source.length; i += 1) target[i] = source[source.length - 1 - i];
      }
      const blob = encodeWav(reversed);
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
      const url = URL.createObjectURL(blob);
      currentUrl.current = url;
      setResultUrl(url);
      setStatus('Done. Preview or download the reversed WAV file.');
      await context.close();
    } catch (error) {
      console.error(error);
      setResultUrl('');
      setStatus('This audio format could not be decoded by your browser. Try MP3, WAV, M4A, or another browser-supported format.');
    }
  }

  return (
    <>
      <Head>
        <title>Audio Reverser – Reverse Audio Online Free | FixTools</title>
        <meta name="description" content="Reverse an audio file online in your browser. Preview the reversed audio and download it as WAV without uploading your file to a server." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fixtools.io/audio-tools/audio-reverser" />
      </Head>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
          <nav className="mb-8 text-sm text-slate-600" aria-label="Breadcrumb"><Link href="/">Home</Link><span className="mx-2">/</span><span>Audio Tools</span><span className="mx-2">/</span><span>Audio Reverser</span></nav>
          <header className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Audio Reverser</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">Reverse songs, voice recordings, sound effects, and other audio directly in your browser. Your file stays on your device.</p>
          </header>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <label htmlFor="audio-file" className="block font-semibold">Choose audio file</label>
            <input id="audio-file" type="file" accept="audio/*" onChange={handleFile} className="mt-3 block w-full rounded-xl border border-slate-300 p-3" />
            {fileName && <p className="mt-3 text-sm text-slate-600">Selected: {fileName}</p>}
            <p className="mt-4 text-sm text-slate-600" aria-live="polite">{status}</p>

            {resultUrl && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold">Reversed audio</h2>
                <audio controls src={resultUrl} className="mt-4 w-full">Your browser does not support audio playback.</audio>
                <a href={resultUrl} download={`reversed-${fileName.replace(/\.[^.]+$/, '') || 'audio'}.wav`} className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">Download reversed WAV</a>
              </div>
            )}
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Private by design</h2><p className="mt-2 text-sm leading-6 text-slate-600">Processing happens locally in your browser; the tool does not need to upload the audio.</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Instant preview</h2><p className="mt-2 text-sm leading-6 text-slate-600">Listen to the reversed result before downloading it.</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Standard output</h2><p className="mt-2 text-sm leading-6 text-slate-600">The reversed result is exported as a broadly compatible WAV file.</p></div>
          </section>
        </div>
      </main>
    </>
  );
}
