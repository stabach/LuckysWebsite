export function clampScrubTime(time: number, duration: number) {
  if (!Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(Math.max(time, 0), duration);
}

export function getScrubTimeFromDrag({
  startTime,
  deltaX,
  duration,
  pixelsForFullDuration = 420
}: {
  startTime: number;
  deltaX: number;
  duration: number;
  pixelsForFullDuration?: number;
}) {
  if (pixelsForFullDuration <= 0) return clampScrubTime(startTime, duration);
  return clampScrubTime(startTime + (deltaX / pixelsForFullDuration) * duration, duration);
}
