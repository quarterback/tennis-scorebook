
import { Season } from '@/types';

// Create extended list of seasons beyond what's in the database
export const extendedSeasonsList: Season[] = [
  // Past seasons
  { id: 'spring-2022', year: 2022, name: 'Spring 2022', isCurrent: false },
  { id: 'spring-2023', year: 2023, name: 'Spring 2023', isCurrent: false },
  { id: 'spring-2024', year: 2024, name: 'Spring 2024', isCurrent: false },
  // Current and future seasons
  { id: 'spring-2025', year: 2025, name: 'Spring 2025', isCurrent: true },
  { id: 'spring-2026', year: 2026, name: 'Spring 2026', isCurrent: false },
  { id: 'spring-2027', year: 2027, name: 'Spring 2027', isCurrent: false },
  { id: 'spring-2028', year: 2028, name: 'Spring 2028', isCurrent: false },
];
