import {useEffect} from 'preact/hooks';
import './ImageViewer.css';

interface ImageViewerProps {
    src: string;
}

const ImageViewer = ({src}: ImageViewerProps) => {
    useEffect(() => {
        const handleResize = () => {
            // ...
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);
    
    return (
        <div className = "image-container">
            <img src={src} className="responsive-image"/>
        </div>
    )
};

export default ImageViewer;