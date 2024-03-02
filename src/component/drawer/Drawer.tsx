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
   } from "@ant-design/icons";
import { Timer } from "../hooks/useTimer";

interface DrawerProps {
    setCurrentImage: (currentImage: string) => void;
    timer: Timer;
  }
  
const Drawer = ({ 
    setCurrentImage,
    timer}: DrawerProps) => {

  const [isHoveringBottom, setIsHoveringBottom] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

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
  }

  const handlePreviousImage = () => {
    if(currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setCurrentImage(images[currentIndex - 1]);
    } else {
        setCurrentIndex(images.length - 1);
        setCurrentImage(images[images.length - 1]);
    }
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

  return (
    <div 
      className={`drawer ${isHoveringBottom ? "open" : ""}`}
      onMouseEnter={() => !isLocking && setIsHoveringBottom(true)}
      onMouseLeave={() => !isLocking && setIsHoveringBottom(false)}
    >
      <div className="upper">
        <FolderOpenFilled onClick={() => setDirectory()} className="openFolder" />
        <PushpinFilled 
          onClick={() => {
            setIsLocking(!isLocking);
            if (!isLocking) setIsHoveringBottom(true); // isLocking が false の場合にのみ isHoveringBottom を true に設定
          }}
          className={`pin ${isLocking ? "pinned" : ""}`}
        />
      </div>
      <div className="controler-container">
        <StepBackwardOutlined onClick={handlePreviousImageWithResetTimer} className="prevImage"/>
        <BackwardFilled onClick={handlePreviousImage} className="prevImage"/>
        {timer.timerRunning ? <PauseCircleFilled onClick={handleStartPauseTimer} className="play-pause"/>
                      : <PlayCircleFilled onClick={handleStartPauseTimer} className="play-pause"/>}
        <ForwardFilled onClick={handleNextImage} className="nextImage"/>
        <StepForwardOutlined onClick={handleNextImageWithResetTimer} className="nextImage"/>
      </div>
    </div>
  );
};

export default Drawer;