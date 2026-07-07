import { avatarGradient } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const initial = (name?.trim()?.[0] ?? "U").toUpperCase();

  if (src && src.startsWith("/uploads")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "avatar"}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-gradient-to-br font-semibold text-white shadow-inner",
        avatarGradient(src),
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
}
