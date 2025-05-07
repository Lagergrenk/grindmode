import { Timestamp } from 'firebase/firestore';

export function getInitialTimeString(timestamp?: Timestamp): string {
  if (timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
