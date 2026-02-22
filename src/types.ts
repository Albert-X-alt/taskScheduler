export interface Task {
  id: string;
  title: string;
  description: string;
  importance: number; // 0-100
  urgency: number; // 0-100
  start_date: string | null; // ISO string
  end_date: string | null; // ISO string
  is_completed: boolean;
}

export type ViewMode = 'matrix' | 'calendar';

export interface Settings {
  autoStart: boolean;
  minimizeToTray: boolean;
  theme: 'light' | 'dark' | 'system';
  notificationTime: '1h' | '1d' | 'none';
}
