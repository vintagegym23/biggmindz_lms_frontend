export function formatDisplayDate(iso: string | Date): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDisplayDateTime(iso: string | Date): string {
  const date = new Date(iso);
  return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export function formatRelativeTime(iso: string | Date): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDisplayDate(date);
}

export function formatMonthYear(iso: string | Date): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export function formatDurationSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

/** minutes may be fractional (e.g. 5.5 = 5m 30s) — always derived from a real video's length. */
export function formatDurationMinutes(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  if (totalSeconds < 3600) return formatDurationSeconds(totalSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.round((totalSeconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function formatBytes(bytes?: number | null): string | undefined {
  if (!bytes) return undefined;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
