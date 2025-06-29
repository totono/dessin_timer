import { Timer } from '../hooks/useTimer';
import './CountdownTimer.css';

interface TimerProps {
    timer: Timer;
}

const CountdownTimer = ({ timer }: TimerProps) => {
    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="countdownTimer">
            {`${formatNumber(timer.minutes)}:${formatNumber(timer.seconds)}`}
        </div>
    );
};

export default CountdownTimer;