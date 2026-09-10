"use client";

import { useState } from "react";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { Button } from "@/components/ui/button";

export default function SpeechInputPreview() {
  const [transcript, setTranscript] = useState("");
  const [capturedBytes, setCapturedBytes] = useState<number | null>(null);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      <SpeechInput
        aria-describedby="speech-preview-note"
        aria-label="Record a local audio sample"
        captureMode="recording"
        onAudioRecorded={async (audio) => {
          setCapturedBytes(audio.size);
          return "";
        }}
        size="icon"
        variant="outline"
      />
      <p id="speech-preview-note" className="text-xs leading-relaxed text-muted-foreground">Activate the control to record a local sample. This preview reports the captured size without transcribing or uploading audio.</p>
      <div className="min-h-16 w-full rounded-md border bg-muted/30 p-4 text-left text-sm" aria-live="polite">
        <p>{capturedBytes === null ? "No audio captured yet." : `${capturedBytes.toLocaleString()} bytes captured locally.`}</p>
        {transcript ? <p className="mt-2 text-muted-foreground">Sample transcript: {transcript}</p> : null}
      </div>
      <Button size="sm" variant="outline" onClick={() => setTranscript("Schedule the design review for Thursday morning.")}>Load sample transcript</Button>
    </div>
  );
}
