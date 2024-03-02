import { useState, useEffect } from 'preact/hooks';


export interface Timer {
    timerRunning: boolean;
    setTimerRunning: (running: boolean) => void;
    minutes: number;
    setTotalSeconds: (seconds: number) => void;
    seconds: number;
    setInitialTotalSecondsState: (seconds: number) => void;
    resetTimer: () => void;
    setShouldResetTimer: (shouldReset: boolean) => void;
  }
  

const useTimer = (initialMinutes = 0, initialSeconds = 0) => {
  const initialTotalSeconds = initialMinutes * 60 + initialSeconds;
  const [timerRunning, setTimerRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);
  const [initialTotalSecondsState, setInitialTotalSecondsState] = useState(initialTotalSeconds);


  const [shouldResetTimer, setShouldResetTimer] = useState(false);

  useEffect(() => {
    if (shouldResetTimer) {
      resetTimer();
      setShouldResetTimer(false);
    }
  }, [shouldResetTimer, initialTotalSecondsState]); // 依存配列に initialTotalSecondsState を追加


  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timerRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(seconds => seconds - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning, totalSeconds]);

  const resetTimer = () => {
    setTotalSeconds(initialTotalSecondsState);
  };

  // 分と秒に変換
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    timerRunning,
    setTimerRunning,
    minutes,
    setTotalSeconds,
    seconds,
    resetTimer,
    setInitialTotalSecondsState,
    setShouldResetTimer,
  };
};

export default useTimer;
