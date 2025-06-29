import { useState, useEffect } from "preact/hooks";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { appWindow } from "@tauri-apps/api/window";
import ImageViewer from './component/imageViewer/ImageViewer';
import Drawer from './component/drawer/Drawer';
import useTimer from './component/hooks/useTimer';
import CountdownTimer from './component/timer/CountdownTimer';
import "./App.css";

function App() {
  const timer = useTimer(5, 0);
  const [currentImage, setCurrentImage] = useState("");
  const [theme, setTheme] = useState("light");
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    console.log(currentImage);
  }, [currentImage]);

  useEffect(() => {
    const setThemeFromOS = async () => {
      try {
        const osTheme = await appWindow.theme() ?? "";
        setTheme(osTheme);
      } catch (error) {
        console.error("Error getting OS theme:", error);
      }
    };

    const unsubscribe = appWindow.onThemeChanged(({ payload: osTheme }: { payload: string }) => {
      setTheme(osTheme);
    });

    setThemeFromOS();

    return async () => {
      await unsubscribe;
    };
  }, []);

  return (
    <div className={`app ${theme}`}>
      <CountdownTimer timer={timer} />
      <ImageViewer 
        src={currentImage === "" ? "" : convertFileSrc(currentImage)} 
        isFlipped={isFlipped}
        rotation={rotation}
      />
      <Drawer 
        setCurrentImage={setCurrentImage} 
        timer={timer}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        rotation={rotation}
        setRotation={setRotation}
      />
    </div>
  );
}

export default App;