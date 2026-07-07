export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "JMS";
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "PKR";
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923324886391";

// Preset gradient avatars (used when a user hasn't uploaded a photo).
export const AVATAR_PRESETS: { id: string; label: string; gradient: string }[] =
  [
    { id: "preset:aurora", label: "Aurora", gradient: "from-fuchsia-500 via-purple-500 to-indigo-500" },
    { id: "preset:sunset", label: "Sunset", gradient: "from-orange-400 via-rose-500 to-pink-600" },
    { id: "preset:ocean", label: "Ocean", gradient: "from-cyan-400 via-sky-500 to-blue-600" },
    { id: "preset:forest", label: "Forest", gradient: "from-emerald-400 via-green-500 to-teal-600" },
    { id: "preset:gold", label: "Gold", gradient: "from-amber-300 via-yellow-500 to-orange-500" },
    { id: "preset:mono", label: "Mono", gradient: "from-slate-500 via-gray-600 to-zinc-700" },
  ];

export function avatarGradient(presetId: string | null | undefined): string {
  const found = AVATAR_PRESETS.find((p) => p.id === presetId);
  return found?.gradient ?? AVATAR_PRESETS[0].gradient;
}
