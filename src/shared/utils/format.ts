import { Timestamp } from 'firebase/firestore';

export const formatTime = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // Pad minutes with leading zero if needed
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export function formatTimeStringToTimestamp(time: string): Timestamp {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return Timestamp.fromDate(date);
}

export function formatTimeStampToTimeString(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
