import { useState, useEffect } from "preact/hooks";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import ImageViewer from './component/imageViewer/ImageViewer';
import Drawer from './component/drawer/Drawer';
import useTimer from './component/hooks/useTimer';
import CountdownTimer from './component/timer/CountdownTimer';
import "./App.css";

function App() {
  const timer = useTimer(5,0);

  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    console.log(currentImage)
  }, [currentImage]);

  return (
    <div>
      <CountdownTimer timer={timer}  />
      <ImageViewer src={currentImage === "" ? "" : convertFileSrc(currentImage)}/>
      <Drawer setCurrentImage={setCurrentImage} timer={timer} />
    </div>
  )
}

export default App;
