import { Delete, PlayArrow, Stop } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Storage } from './localStorage';

function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(() => Storage.getTime());
  const [timeLog, setTimeLog] = useState(() => Storage.getTimeLog());

  const intervalRef = useRef(null);

  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  const handleUnload = () => {
    Storage.setTime(timeRef.current); // 왜 time을 쓰면 안되지?
  };

  function start() {
    if (!isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((time) => {
          const { seconds, minutes, hours } = time;

          if (seconds < 59) {
            return { ...time, seconds: seconds + 1 };
          } else if (minutes < 59) {
            return { ...time, seconds: 0, minutes: minutes + 1 };
          } else {
            return { seconds: 0, minutes: 0, hours: hours + 1 };
          }
        });
      }, 1000);
      setIsRunning(true);
    }
  }

  function stop() {
    clearInterval(intervalRef.current);

    const now = new Date();
    const hour24 = now.getHours();
    const currentMinute = now.getMinutes();
    const minutesTime = currentMinute < 10 ? `0${currentMinute}` : currentMinute;
    const hour12 = hour24 % 12 || 12;
    const amOrPm = hour24 < 12 ? '오전' : '오후';
    const timeLog = { time, current: `${amOrPm} ${hour12}:${minutesTime}` };

    setTimeLog((prev) => [...prev, timeLog]);
    setIsRunning(false);

    Storage.addTimeLog(timeLog);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime({ seconds: 0, minutes: 0, hours: 0 });
    setTimeLog([]);

    Storage.clearTime();
    Storage.clearTimeLog();
  }

  const getPrettyTime = (time) => {
    const { seconds, minutes, hours } = time;
    const hoursTime = hours < 10 ? `0${hours}` : hours;
    const minutesTime = minutes < 10 ? `0${minutes}` : minutes;
    const secondsTime = seconds < 10 ? `0${seconds}` : seconds;

    return `${hoursTime}:${minutesTime}:${secondsTime}`;
  };

  return (
    <Container>
      <MainTimeContainer>
        <MainTime>{getPrettyTime(time)}</MainTime>
        <ButtonContainer>
          {!isRunning && (
            <Button onClick={start} startIcon={<PlayArrow />} variant="outlined" color="secondary">
              시작
            </Button>
          )}
          {isRunning && (
            <Button onClick={stop} startIcon={<Stop />} variant="contained" color="secondary">
              기록
            </Button>
          )}
          <Button onClick={reset} startIcon={<Delete />} variant="outlined" color="secondary">
            리셋
          </Button>
        </ButtonContainer>
      </MainTimeContainer>
      <TimeLogList>
        {timeLog.map(({ time, current }, index) => (
          <li key={index}>
            <TimeLogTime>{getPrettyTime(time)}</TimeLogTime>
            <TimeLogCurrent>{current}</TimeLogCurrent>
          </li>
        ))}
      </TimeLogList>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const MainTime = styled.span`
  font-size: 30px;
  margin-right: 10px;
`;

const MainTimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const ButtonContainer = styled.div``;

const TimeLogList = styled.ul`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  gap: 10px;
  li {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    span {
      display: flex;
    }
  }
`;

const Divider = styled.span``;

const TimeLogTime = styled.span``;

const TimeLogCurrent = styled.span``;

export default StopWatch;
