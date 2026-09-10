"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport {\n  AudioPlayer,\n  AudioPlayerControlBar,\n  AudioPlayerDurationDisplay,\n  AudioPlayerElement,\n  AudioPlayerMuteButton,\n  AudioPlayerPlayButton,\n  AudioPlayerSeekBackwardButton,\n  AudioPlayerSeekForwardButton,\n  AudioPlayerTimeDisplay,\n  AudioPlayerTimeRange,\n  AudioPlayerVolumeRange,\n} from \"@/components/ai-elements/audio-player\";\n\nconst Example = () => (\n  <div className=\"flex size-full items-center justify-center\">\n    <AudioPlayer>\n      <AudioPlayerElement src=\"https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2025-11-10T22_07_46_Hayden_pvc_sp108_s50_sb75_se0_b_m2.mp3\" />\n      <AudioPlayerControlBar>\n        <AudioPlayerPlayButton />\n        <AudioPlayerSeekBackwardButton seekOffset={10} />\n        <AudioPlayerSeekForwardButton seekOffset={10} />\n        <AudioPlayerTimeDisplay />\n        <AudioPlayerTimeRange />\n        <AudioPlayerDurationDisplay />\n        <AudioPlayerMuteButton />\n        <AudioPlayerVolumeRange />\n      </AudioPlayerControlBar>\n    </AudioPlayer>\n  </div>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
