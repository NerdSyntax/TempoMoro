import { useState, useEffect, useRef } from 'react';
import { Settings, X, Trophy, Minus, Play, Pause, Square, Maximize2, Minimize2 } from 'lucide-react';
import { useSettings } from './context/SettingsContext';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  const { lang, pomodoro, shortBreak, longBreak, cyclesToLong, theme, backgroundType, backgroundUrl, stats, saveSettings, t } = useSettings();
  
  const [timeLeft, setTimeLeft] = useState(pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionState, setSessionState] = useState('Work'); // Work, ShortBreak, LongBreak
  const [cycles, setCycles] = useState(0);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [editSettings, setEditSettings] = useState({});
  const [isMini, setIsMini] = useState(false);

  const timerRef = useRef(null);
  const draggableRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (sessionState === 'Work') {
      new Notification('Tempomoro', { body: t.rest });
      const newCycles = cycles + 1;
      setCycles(newCycles);
      saveSettings({ 
         stats: { 
            totalPomodoros: (stats?.totalPomodoros || 0) + 1, 
            bestStreak: Math.max(stats?.bestStreak || 0, newCycles) 
         } 
      });
      if (newCycles % cyclesToLong === 0) {
        setSessionState('LongBreak');
        setTimeLeft(longBreak * 60);
      } else {
        setSessionState('ShortBreak');
        setTimeLeft(shortBreak * 60);
      }
    } else {
      new Notification('Tempomoro', { body: t.focus });
      setSessionState('Work');
      setTimeLeft(pomodoro * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!isRunning) {
      if (sessionState === 'Work') setTimeLeft(pomodoro * 60);
      else if (sessionState === 'ShortBreak') setTimeLeft(shortBreak * 60);
      else if (sessionState === 'LongBreak') setTimeLeft(longBreak * 60);
    }
  }, [pomodoro, shortBreak, longBreak, isRunning, sessionState]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, sessionState, cycles, pomodoro, shortBreak, longBreak, cyclesToLong]);

  const openSettings = () => {
    setEditSettings({ lang, pomodoro, shortBreak, longBreak, cyclesToLong, theme, backgroundType, backgroundUrl });
    setShowSettings(true);
  };

  const saveEditedSettings = () => {
    saveSettings({ ...editSettings });
    setShowSettings(false);
  };

  const toggleMiniMode = () => {
    setIsMini(!isMini);
  };

  const closeWindow = () => window.electronAPI && window.electronAPI.closeWindow();
  const minimizeWindow = () => window.electronAPI && window.electronAPI.minimizeWindow();

  const getUrl = (url, type) => {
    if (!url && type === 'youtube') return 'https://www.youtube.com';
    if (!url) return '';
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  };

  const totalSeconds = sessionState === 'Work' ? pomodoro * 60 : (sessionState === 'ShortBreak' ? shortBreak * 60 : longBreak * 60);
  const progressPercent = (timeLeft / totalSeconds) * 100;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className={`app-container ${backgroundType === 'theme' ? 'theme-bg' : 'transparent-bg'}`}>
      
      {/* DRAGGABLE TITLE BAR FOR WINDOW */}
      <div className="title-bar">
         <div className="title-drag-area">TEMPOMORO</div>
         <div className="window-controls">
           <button onClick={minimizeWindow} className="ctrl-btn"><Minus size={14}/></button>
           <button onClick={closeWindow} className="ctrl-btn close-btn-w"><X size={14}/></button>
         </div>
      </div>

      {/* BACKGROUND LAYER */}
      {backgroundType === 'image' && backgroundUrl && (
        <img src={getUrl(backgroundUrl, 'image')} className="background-layer" alt="bg" />
      )}
      {backgroundType === 'youtube' && (
        <webview 
          src={getUrl(backgroundUrl, 'youtube')} 
          className="background-layer webview-bg"
          partition="persist:youtube"
        />
      )}

      {/* DRAGGABLE WIDGET LAYER */}
      <Draggable nodeRef={draggableRef} handle=".drag-handle" bounds="parent" defaultPosition={{x: window.innerWidth - 380, y: 50}}>
        <div ref={draggableRef} style={{ position: 'absolute', zIndex: 100, pointerEvents: 'auto' }}>
          {isMini ? (
            <div className="mini-widget-card drag-handle" title="Drag to move">
              <div className="mini-info">
                  <span className="mini-dot" style={{background: sessionState==='Work' ? 'var(--accent-primary)' : '#4ade80'}}></span>
                  <span className="mini-time">{formatTime(timeLeft)}</span>
              </div>
              <div className="mini-controls no-drag">
                <button className="icon-btn mini-btn primary" onClick={toggleTimer}>
                  {isRunning ? <Pause size={14}/> : <Play size={14} style={{marginLeft: 2}}/>}
                </button>
                <button className="icon-btn mini-btn" onClick={toggleMiniMode} title="Expandir">
                  <Maximize2 size={14}/>
                </button>
              </div>
            </div>
          ) : (
            <div className="widget-card">
              
              <div className="widget-top-bar drag-handle" title="Drag to move">
                 <span className="brand-title">TEMPOMORO</span>
                 <div className="top-controls no-drag">
                   <button className="tiny-ctrl hover-op" onClick={toggleMiniMode} title="Mini Modo"><Minimize2 size={14}/></button>
                 </div>
              </div>

              <div className="state-tabs no-drag">
                 <button className={`tab-btn ${sessionState === 'Work' ? 'active' : ''}`} onClick={() => { if(!isRunning){ setSessionState('Work'); setTimeLeft(pomodoro*60); } }}>Pomodoro</button>
                 <button className={`tab-btn ${sessionState === 'ShortBreak' ? 'active' : ''}`} onClick={() => { if(!isRunning){ setSessionState('ShortBreak'); setTimeLeft(shortBreak*60); } }}>Short Break</button>
                 <button className={`tab-btn ${sessionState === 'LongBreak' ? 'active' : ''}`} onClick={() => { if(!isRunning){ setSessionState('LongBreak'); setTimeLeft(longBreak*60); } }}>Long Break</button>
              </div>

              {/* SVG CIRCULAR PROGRESS TIMER */}
              <div className="progress-ring-container drag-handle" style={{cursor: 'grab'}}>
                <svg className="progress-ring" width="220" height="220">
                  <circle stroke="var(--card-border)" strokeWidth="10" fill="transparent" r={radius} cx="110" cy="110" />
                  <circle
                    className="progress-ring-circle" stroke="var(--accent-primary)" strokeWidth="10"
                    fill="transparent" strokeLinecap="round" r={radius} cx="110" cy="110"
                    style={{
                      strokeDasharray: circumference, strokeDashoffset: strokeDashoffset,
                      transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none',
                      transform: 'rotate(-90deg)', transformOrigin: '50% 50%'
                    }}
                  />
                </svg>
                <div className="timer-display-inner" style={{pointerEvents: 'none'}}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="widget-controls no-drag">
                 <button className="play-btn" onClick={toggleTimer}>
                   {isRunning ? <Pause size={24}/> : <Play style={{marginLeft: 4}} size={24}/>}
                 </button>
                 <button className="icon-btn" onClick={() => { setIsRunning(false); setTimeLeft(totalSeconds); }}>
                    <Square size={18}/>
                 </button>
              </div>

              <div className="widget-footer no-drag">
                 <span className="streak-badge">Cycle: {cycles} 🍎</span>
                 <div className="footer-icons">
                   <button onClick={() => setShowStats(true)} className="icon-btn" title={t.stats_btn}><Trophy size={16}/></button>
                   <button onClick={openSettings} className="icon-btn" title={t.settings}><Settings size={16}/></button>
                 </div>
              </div>

            </div>
          )}
        </div>
      </Draggable>

      {/* MODALS */}
      {showSettings && !isMini && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', marginbottom: 20}}>
              <h3>{t.settings}</h3>
              <button onClick={() => setShowSettings(false)} className="close-btn"><X/></button>
            </div>
            
            <div className="settings-group" style={{marginTop: 15}}>
              <label>{t.theme}</label>
              <select value={editSettings.theme} onChange={(e) => setEditSettings({...editSettings, theme: e.target.value})}>
                <option value="hacker">Hacker (Dark)</option>
                <option value="minimal">Minimal (Light)</option>
                <option value="kawaii">Kawaii (Pink/Purple)</option>
              </select>
            </div>

            <div className="settings-group">
              <label>Fondo / Background</label>
              <select value={editSettings.backgroundType || 'theme'} onChange={(e) => setEditSettings({...editSettings, backgroundType: e.target.value})}>
                <option value="theme">Solo Tema</option>
                <option value="image">Imagen / GIF URL</option>
                <option value="youtube">Navegador Web (YouTube/etc)</option>
              </select>
            </div>

            {editSettings.backgroundType && editSettings.backgroundType !== 'theme' && (
              <div className="settings-group">
                <label>URL del Fondo</label>
                <input type="text" value={editSettings.backgroundUrl || ''} onChange={(e) => setEditSettings({...editSettings, backgroundUrl: e.target.value})} placeholder="https://www.youtube.com..." />
              </div>
            )}

            <div className="settings-group">
              <label>{t.pomodoro_len}</label>
              <input type="number" min="1" max="180" value={editSettings.pomodoro} onChange={(e) => setEditSettings({...editSettings, pomodoro: Number(e.target.value)})} />
            </div>
            <div className="settings-group">
              <label>{t.short_len}</label>
              <input type="number" min="1" max="60" value={editSettings.shortBreak} onChange={(e) => setEditSettings({...editSettings, shortBreak: Number(e.target.value)})} />
            </div>

            <button className="glow-btn" style={{width: '100%', marginTop: 15}} onClick={saveEditedSettings}>{t.save}</button>
          </div>
        </div>
      )}

      {showStats && !isMini && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
              <h3>{t.stats_btn} 🏆</h3>
              <button onClick={() => setShowStats(false)} className="close-btn"><X/></button>
            </div>
            <div className="settings-group">
              <p><strong>{t.total_pomos}:</strong> {stats?.totalPomodoros || 0}</p>
              <p><strong>{t.best_streak}:</strong> {stats?.bestStreak || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
