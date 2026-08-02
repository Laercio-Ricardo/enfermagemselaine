import { Flashcard } from '../types';

export function calculateSM2(
  card: Flashcard,
  rating: 'Errei' | 'Difícil' | 'Médio' | 'Fácil'
): { nextReviewDate: string; intervalDays: number; repetitions: number; easeFactor: number } {
  let q: number;
  switch (rating) {
    case 'Errei':
      q = 1;
      break;
    case 'Difícil':
      q = 2;
      break;
    case 'Médio':
      q = 4;
      break;
    case 'Fácil':
      q = 5;
      break;
  }

  let easeFactor = card.easeFactor || 2.5;
  let repetitions = card.repetitions || 0;
  let intervalDays = card.intervalDays || 1;

  // Calculate new Ease Factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    nextReviewDate: nextDate.toISOString(),
    intervalDays,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(2)),
  };
}
