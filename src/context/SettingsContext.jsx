import { createContext, useState, useEffect, useContext } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [lang, setLang] = useState('es'); // 'es' or 'en'
  const [pomodoro, setPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [cyclesToLong, setCyclesToLong] = useState(4);
  const [theme, setTheme] = useState('hacker');
  const [backgroundType, setBackgroundType] = useState('youtube');
  const [backgroundUrl, setBackgroundUrl] = useState('https://www.youtube.com');
  const [stats, setStats] = useState({ totalPomodoros: 0, bestStreak: 0 });
  
  useEffect(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lang) setLang(parsed.lang);
        if (parsed.pomodoro) setPomodoro(parsed.pomodoro);
        if (parsed.shortBreak) setShortBreak(parsed.shortBreak);
        if (parsed.longBreak) setLongBreak(parsed.longBreak);
        if (parsed.cyclesToLong) setCyclesToLong(parsed.cyclesToLong);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.backgroundType) setBackgroundType(parsed.backgroundType);
        if (parsed.backgroundUrl) setBackgroundUrl(parsed.backgroundUrl);
        if (parsed.stats) setStats(parsed.stats);
      } catch (e) {
        console.error("Error loading settings", e);
      }
    }
  }, []);

  const saveSettings = (newSettings) => {
    const combined = { lang, pomodoro, shortBreak, longBreak, cyclesToLong, theme, backgroundType, backgroundUrl, stats, ...newSettings };
    localStorage.setItem('pomodoroSettings', JSON.stringify(combined));
    
    if (newSettings.lang) setLang(newSettings.lang);
    if (newSettings.pomodoro) setPomodoro(newSettings.pomodoro);
    if (newSettings.shortBreak) setShortBreak(newSettings.shortBreak);
    if (newSettings.longBreak) setLongBreak(newSettings.longBreak);
    if (newSettings.cyclesToLong) setCyclesToLong(newSettings.cyclesToLong);
    if (newSettings.theme) setTheme(newSettings.theme);
    if (newSettings.backgroundType) setBackgroundType(newSettings.backgroundType);
    if (newSettings.backgroundUrl) setBackgroundUrl(newSettings.backgroundUrl);
    if (newSettings.stats) setStats(newSettings.stats);
  };

  const t = {
    es: {
      focus: 'ENFOQUE',
      rest: 'DESCANSO',
      casual: 'CASUAL',
      deepwork: 'DEEP WORK',
      hardcore: 'HARDCORE',
      start: 'INICIAR',
      pause: 'PAUSAR',
      lock_in: 'ENCERRARSE (LOCK IN)',
      settings: 'Ajustes',
      save: 'Guardar',
      close: 'Cerrar',
      duration: 'Duración',
      pomodoro_len: 'Tiempo de Pomodoro (min)',
      short_len: 'Descanso Corto (min)',
      long_len: 'Descanso Largo (min)',
      cycles_lbl: 'Ciclos antes del Largo',
      language: 'Idioma (EN/ES)',
      theme: 'Tema Visual',
      streak: 'Racha',
      penalty: 'PENALIZACIÓN: FOCO PERDIDO. RACHA EN CERO.',
      warning: 'ADVERTENCIA: ¡NO ESCAPES!',
      sys_casual: 'DESHABILITADO',
      sys_deepwork: 'ACTIVO',
      sys_hardcore: 'MÁXIMO',
      whitelist_lbl: 'Lista Blanca (ej: chrome.exe, Code.exe)',
      yt_link: 'Link de YouTube (LoFi / Música)',
      stats_btn: 'Estadísticas',
      total_pomos: 'Pomodoros Completados',
      best_streak: 'Mejor Racha',
      achi_1: 'Novato del Enfoque',
      achi_2: 'Deep Work Master (10+)'
    },
    en: {
      focus: 'FOCUS',
      rest: 'REST',
      casual: 'CASUAL',
      deepwork: 'DEEP WORK',
      hardcore: 'HARDCORE',
      start: 'START',
      pause: 'PAUSE',
      lock_in: 'LOCK IN',
      settings: 'Settings',
      save: 'Save',
      close: 'Close',
      duration: 'Duration',
      pomodoro_len: 'Pomodoro Time (min)',
      short_len: 'Short Break (min)',
      long_len: 'Long Break (min)',
      cycles_lbl: 'Cycles to Long Break',
      language: 'Language (EN/ES)',
      theme: 'Visual Theme',
      streak: 'Streak',
      penalty: 'PENALTY: FOCUS LOST. STREAK ZEROED.',
      warning: 'WARNING: DO NOT ESCAPE!',
      sys_casual: 'DISABLED',
      sys_deepwork: 'ACTIVE',
      sys_hardcore: 'MAXIMUM',
      whitelist_lbl: 'Whitelist (e.g., chrome.exe, Code.exe)',
      yt_link: 'YouTube Link (LoFi / Music)',
      stats_btn: 'Statistics',
      total_pomos: 'Total Pomodoros',
      best_streak: 'Best Streak',
      achi_1: 'Focus Novice',
      achi_2: 'Deep Work Master (10+)'
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      lang, pomodoro, shortBreak, longBreak, cyclesToLong, theme, backgroundType, backgroundUrl, stats,
      saveSettings, 
      t: t[lang] 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
