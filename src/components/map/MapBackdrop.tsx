/** Декоративный фон карты: мягкие цветные пятна и точечная сетка. */
export function MapBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="map-dots absolute inset-0" />
      <div className="absolute -top-28 -left-24 size-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-1/3 -right-28 size-96 rounded-full bg-xp/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 size-80 rounded-full bg-success/15 blur-3xl" />
    </div>
  );
}
