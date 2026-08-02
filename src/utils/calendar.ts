import { ScheduleItem } from '../types';

export function getGoogleCalendarUrl(item: ScheduleItem): string {
  const title = encodeURIComponent(`[Estudo Enfermagem] ${item.subject}: ${item.topic}`);
  const details = encodeURIComponent(
    `Sessão de estudos agendada na plataforma Enfermagem Pro.\nMatéria: ${item.subject}\nTópico: ${item.topic}\nObservações: ${item.notes || 'Sem observações'}`
  );
  const location = encodeURIComponent('Enfermagem Pro - Plataforma Digital');

  // Next matching day of week
  const now = new Date();
  const currentDay = now.getDay();
  let daysUntil = item.dayOfWeek - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7;
  }

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysUntil);

  // Time slot parsing, e.g. "09:00 - 10:30"
  const timeMatch = item.timeSlot.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  let startHour = 9, startMin = 0, endHour = 10, endMin = 30;
  if (timeMatch) {
    startHour = parseInt(timeMatch[1], 10);
    startMin = parseInt(timeMatch[2], 10);
    endHour = parseInt(timeMatch[3], 10);
    endMin = parseInt(timeMatch[4], 10);
  }

  const startIso = new Date(targetDate.setHours(startHour, startMin, 0)).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endIso = new Date(targetDate.setHours(endHour, endMin, 0)).toISOString().replace(/-|:|\.\d\d\d/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}&recur=RRULE:FREQ=WEEKLY`;
}

export function generateIcsFile(items: ScheduleItem[]): string {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Enfermagem Pro//Cronograma de Estudos//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Cronograma Tecnico Enfermagem',
  ].join('\r\n');

  items.forEach((item) => {
    const timeMatch = item.timeSlot.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
    let startHour = 9, startMin = 0, endHour = 10, endMin = 30;
    if (timeMatch) {
      startHour = parseInt(timeMatch[1], 10);
      startMin = parseInt(timeMatch[2], 10);
      endHour = parseInt(timeMatch[3], 10);
      endMin = parseInt(timeMatch[4], 10);
    }

    const now = new Date();
    const daysUntil = (item.dayOfWeek - now.getDay() + 7) % 7;
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + daysUntil);

    const startDate = new Date(eventDate.setHours(startHour, startMin, 0)).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(eventDate.setHours(endHour, endMin, 0)).toISOString().replace(/-|:|\.\d\d\d/g, '');

    icsContent += '\r\n' + [
      'BEGIN:VEVENT',
      `SUMMARY:[Estudo] ${item.subject} - ${item.topic}`,
      `DESCRIPTION:Revisão para Concurso de Técnico em Enfermagem. Matéria: ${item.subject}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      'RRULE:FREQ=WEEKLY',
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  });

  icsContent += '\r\nEND:VCALENDAR';
  return icsContent;
}

export function downloadIcsSchedule(items: ScheduleItem[]) {
  const content = generateIcsFile(items);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'cronograma_estudos_enfermagem.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
