import { useState, useEffect } from 'preact/hooks';
import { Select } from "@kuma-ui/core"
import { Timer } from '../hooks/useTimer';
import './CountdownTimer.css';

interface TimerProps {
    timer: Timer;
}

const CountdownTimer = ({ timer }: TimerProps) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [timeUnit, setTimeUnit] = useState('minute');
    const [timeOptions, setTimeOptions] = useState([...Array(10).keys()].map(i => i + 1));

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            const { innerWidth, innerHeight } = window;
            const { clientX, clientY } = e;

            const hoverRight30 = clientX > innerWidth * 0.8;
            const hoverTop50 = clientY < innerHeight * 0.55;

            if (hoverRight30 && hoverTop50) {
                setDrawerVisible(true);
            } else {
                setDrawerVisible(false);
            }
        }

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

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
        <div className="countdownTimer">
            {`${formatNumber(timer.minutes)}:${formatNumber(timer.seconds)}`}
            {drawerVisible && (
                <div className="timeSettingDrawer">
                    <Select onChange={handleTimeChange}>
                        {timeOptions.map(i => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </Select>
                    <Select onChange={handleTimeUnitChange}>
                        <option value="minute">分</option>
                        <option value="second">秒</option>
                    </Select>
                </div>
            )}
        </div>
    );
};

export default CountdownTimer;