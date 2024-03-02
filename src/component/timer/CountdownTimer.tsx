import { useState, useEffect } from 'preact/hooks';
import { Select } from "@kuma-ui/core"
import { Timer } from '../hooks/useTimer';
import './CountdownTimer.css';

interface TimerProps{
    timer: Timer;
}

const CountdownTimer = ({ timer }:TimerProps) => {
  const [drawerVisible, setDrawerVisible] = useState(false);


  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // ウィンドウサイズを取得
      const { innerWidth, innerHeight } = window;
      // マウスの位置を取得
      const { clientX, clientY } = e;
  
      const hoverRight30 = clientX > innerWidth * 0.8;
  
      const hoverTop50 = clientY < innerHeight * 0.4;
  
      // 条件を満たしたらドロワーを開く
      if (hoverRight30 && hoverTop50) {
        setDrawerVisible(true);
      } else {
        setDrawerVisible(false);
      }
    }
    // イベントリスナーを追加
    window.addEventListener('mousemove', handleMouseMove);
  
    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  const formatNumber = (num: number) => num.toString().padStart(2, '0');


  const handleTimeChange = (e: Event) =>{
    const newMinutes = parseInt((e.target as HTMLInputElement).value, 10);
    timer.setTotalSeconds(newMinutes * 60);
    timer.setInitialTotalSecondsState(newMinutes * 60);
    timer.setShouldResetTimer(true);
  }

  return (
    <div className="countdownTimer">
     {`${formatNumber(timer.minutes)}:${formatNumber(timer.seconds)}`}
     {drawerVisible && (
        <div className="timeSettingDrawer">
          <Select onChange={handleTimeChange} >
            {[...Array(10).keys()].map(i => (
              <option key={i} value={i+1}>{i+1} 分</option>
            ))}
          </Select>
        </div>)}
    </div>
  );
};

export default CountdownTimer;