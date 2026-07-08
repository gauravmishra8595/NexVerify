export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827]">
      <div className="flex items-center gap-2.5">
        <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400" />
      </div>
    </div>
  );
}
