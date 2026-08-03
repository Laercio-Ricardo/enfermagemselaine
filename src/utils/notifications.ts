export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    alert('Seu navegador não suporta notificações de área de trabalho.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      ...options,
    } as any);
  }
}

export function scheduleDailyStudyReminder(timeString: string, callback: () => void) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  return setTimeout(() => {
    callback();
    // Reschedule for next day
    scheduleDailyStudyReminder(timeString, callback);
  }, delay);
}
