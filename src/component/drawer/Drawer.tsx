import { useState, useEffect } from "preact/hooks";
import "./Drawer.css";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { 
  ForwardFilled,
  BackwardFilled,
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  PushpinFilled,
  FolderOpenFilled,
  ExpandOutlined,
  ExportOutlined,
  SwapOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
   } from "@ant-design/icons";
import { Timer } from "../hooks/useTimer";
import { appWindow } from '@tauri-apps/api/window';

interface DrawerProps {
    setCurrentImage: (currentImage: string) => void;
    timer: Timer;
    isFlipped: boolean;
    setIsFlipped: (flipped: boolean) => void;
    rotation: number;
    setRotation: (rotation: number) => void;
  }
  
const Drawer = ({ 
    setCurrentImage,
    timer,
    isFlipped,
    setIsFlipped,
    rotation,
    setRotation}: DrawerProps) => {

  const [isHoveringBottom, setIsHoveringBottom] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
  const [timeUnit, setTimeUnit] = useState('minute');
  const [timeOptions, setTimeOptions] = useState([...Array(10).keys()].map(i => i + 1));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const hoverThreshold = window.innerHeight * 0.7; // 画面の高さの70%を閾値とする
      if (event.clientY > hoverThreshold) {
        setIsHoveringBottom(true);
      } else {
        setIsHoveringBottom(false);
      }
    };

    if (!isLocking) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    // イベントリスナーをクリーンアップする
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isLocking]); // 依存配列にisLockingを含める

  // when timer running out, go to next image
  useEffect(() => {
    if(timer.seconds === 0 && timer.minutes === 0) {
      if(currentIndex < images.length - 1) {
        handleNextImage();
      }
      else{
        setCurrentIndex(0);
        setCurrentImage(images[0]);
      }
      timer.resetTimer()
    }
  }, [timer.seconds, timer.minutes]);


  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const setDirectory = async () => {
      try{
          const selectedDirectory = await open({
              directory: true,
              multiple: false,
              filters: [{
                  name: "Images",
                  extensions: ["jpg", "png", "gif", "jpeg"]
              }]
          });
          if(selectedDirectory) {
              console.log(selectedDirectory)
              const imageArr: string[] = await invoke("read_directory", {path: selectedDirectory});
              setImages(imageArr);
              setCurrentImage(imageArr[currentIndex]);
              // Reset transformations when loading new directory
              setIsFlipped(false);
              setRotation(0);
          }
      } catch (e) {
          console.log(e);
      }
  }


  const handleNextImage = () => {
    if(currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentImage(images[currentIndex + 1]);
    } else {
        setCurrentIndex(0);
        setCurrentImage(images[0]);
    }
    // Reset transformations when changing image
    setIsFlipped(false);
    setRotation(0);
  }

  const handlePreviousImage = () => {
    if(currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setCurrentImage(images[currentIndex - 1]);
    } else {
        setCurrentIndex(images.length - 1);
        setCurrentImage(images[images.length - 1]);
    }
    // Reset transformations when changing image
    setIsFlipped(false);
    setRotation(0);
  }


  const handleNextImageWithResetTimer = () => {
    handleNextImage();
    timer.setShouldResetTimer(true);
  }

  const handlePreviousImageWithResetTimer = () => {
    handlePreviousImage();
    timer.setShouldResetTimer(true);
  }


  // タイマーの開始/停止
  const handleStartPauseTimer = () => {
    if (!timer.timerRunning && timer.seconds === 0) {
        timer.setTotalSeconds(timer.minutes * 60);
    }
    timer.setTimerRunning(!timer.timerRunning);
  };

  // Image transformation handlers
  const handleFlipImage = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRotateLeft = () => {
    setRotation(rotation - 10);
  };

  const handleRotateRight = () => {
    setRotation(rotation + 10);
  };

  // Timer setting handlers
  const handleTimeUnitChange = (e: Event) => {
    const newTimeUnit = (e.target as HTMLSelectElement).value;
    setTimeUnit(newTimeUnit);

    if (newTimeUnit === 'minute') {
      setTimeOptions([...Array(10).keys()].map(i => i + 1));
    } else {
      // make step 10 seconds
      setTimeOptions([...Array(60).keys()].map(i => i + 1).filter(i => i % 10 === 0));
    }
  };

  const handleTimeChange = (e: Event) => {
    const newTime = parseInt((e.target as HTMLSelectElement).value, 10);
    const seconds = timeUnit === 'minute' ? newTime * 60 : newTime;

    timer.setTotalSeconds(seconds);
    timer.setInitialTotalSecondsState(seconds);
    timer.setShouldResetTimer(true);
  };

  return (
    <div 
      className={`drawer ${isHoveringBottom ? "open" : ""}`}
      onMouseEnter={() => !isLocking && setIsHoveringBottom(true)}
      onMouseLeave={() => !isLocking && setIsHoveringBottom(false)}
    >
      <div className="upper">
        <div>
        <FolderOpenFilled onClick={() => setDirectory()} className="openFolder" />
        </div>
        <div className="upper-right">
        {isAlwaysOnTop ? <ExportOutlined onClick={() => {appWindow.setAlwaysOnTop(false); setIsAlwaysOnTop(false);}} className="always-on-top"/> :
                        <ExpandOutlined onClick={() => {appWindow.setAlwaysOnTop(true); setIsAlwaysOnTop(true);}} className="always-on-top"/>}
        <PushpinFilled 
          onClick={() => {
            setIsLocking(!isLocking);
            if (!isLocking) setIsHoveringBottom(true); // isLocking が false の場合にのみ isHoveringBottom を true に設定
          }}
          className={`pin ${isLocking ? "pinned" : ""}`}
          />
        </div>
      </div>
      <div className="controler-container">
        {/* Timer setting controls */}
        <div className="timer-controls">
          <select onChange={handleTimeChange} className="time-select">
            {timeOptions.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <select onChange={handleTimeUnitChange} className="unit-select">
            <option value="minute">分</option>
            <option value="second">秒</option>
          </select>
        </div>

        <StepBackwardOutlined onClick={handlePreviousImageWithResetTimer} className="prevImage"/>
        <BackwardFilled onClick={handlePreviousImage} className="prevImage"/>
        {timer.timerRunning ? <PauseCircleFilled onClick={handleStartPauseTimer} className="play-pause"/>
                      : <PlayCircleFilled onClick={handleStartPauseTimer} className="play-pause"/>}
        <ForwardFilled onClick={handleNextImage} className="nextImage"/>
        <StepForwardOutlined onClick={handleNextImageWithResetTimer} className="nextImage"/>
        
        {/* Image transformation controls */}
        <div className="image-controls">
          <RotateLeftOutlined onClick={handleRotateLeft} className="rotate-btn" title="10度左回転" />
          <SwapOutlined onClick={handleFlipImage} className="flip-btn" title="左右反転" />
          <RotateRightOutlined onClick={handleRotateRight} className="rotate-btn" title="10度右回転" />
        </div>
      </div>
    </div>
  );
};

export default Drawer;