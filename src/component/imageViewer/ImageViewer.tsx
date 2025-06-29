import {useEffect} from 'preact/hooks';
import './ImageViewer.css';

interface ImageViewerProps {
    src: string;
    isFlipped: boolean;
    rotation: number;
}

const ImageViewer = ({src, isFlipped, rotation}: ImageViewerProps) => {
    useEffect(() => {
        const handleResize = () => {
            // ...
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);
    
    const imageStyle = {
        transform: `scaleX(${isFlipped ? -1 : 1}) rotate(${rotation}deg)`
    };
    
    return (
        <div className = "image-container">
            <img 
                src={src} 
                className="responsive-image"
                style={imageStyle}
            />
        </div>
    )
};

export default ImageViewer;