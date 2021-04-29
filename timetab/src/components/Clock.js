import '../css/Clock.css';
import React, { useState, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import Zoom from '@material-ui/core/Zoom';
import 'moment-timezone';
import {logEvent} from './analytics';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


function Clock(props) {

  const [date, setDate] = useState(new Date());
  const [timerTime, setTimerTime] = useState(props.timerTime); // seconds
  const [timerTimeRemaining, setTimerTimeRemaining] = useState(props.timerTime);

  useInterval(() => {
    // Your custom logic here
    setDate(new Date());
    if (timerTimeRemaining > 0) {
      setTimerTimeRemaining(timerTimeRemaining - 1)
      document.title = timerTimeRemaining + "s"
    }
    if (timerTimeRemaining === 0) {
      document.title = 0 + "s"
      notifyTimer(props.timerTime)
      stopTimer()
    }

  }, 1000);

  function notifyTimer(timerTime) {
    if (navigator.serviceWorker.controller != null) {
      navigator.serviceWorker.controller.postMessage({
        "event" : "notification",
        "time" : parseInt(timerTime/60)
      });
    }
  }

  const stopTimer = () => {
    document.getElementById('timer-end').play();
    setTimerTime(null)
    setTimerTimeRemaining(null)
    logEvent("ui_interaction", {
      "section": "clock",
      "subsection": "timer",
      "action": "end",
      "element": "timer",
    })
  }
  const deleteTimer = () => {
    document.getElementById('timer-remove').play();
    setTimerTime(null)
    setTimerTimeRemaining(null)
    document.title = "timetab"
    logEvent("ui_interaction", {
      "section": "clock",
      "subsection": "timer",
      "action": "remove",
      "element": "timer",
      "value" : undefined
    })

  }

  // transfer prop changes to state
  const previousTimerTimeRef = useRef();
  const previousTimerTime = previousTimerTimeRef.current;
  if (props.timerTime !== previousTimerTime && props.timerTime !== timerTime) {
    setTimerTime(props.timerTime);
    if (props.timerTime) { 
      setTimerTimeRemaining(props.timerTime); 
    }
  }
  useEffect(() => {
    previousTimerTimeRef.current = props.timerTime;
  });

  return (
    <React.Fragment>
      <div id="clock" style={{ "display": timerTimeRemaining ? "none" : "block" }} className="clock" onMouseDown={props.onMouseDown}><Moment format="H·mm" date={date}></Moment></div>
      <Zoom in={timerTime > 0}>
        <div id="timer" onClick={() => deleteTimer()} className="timer" style={{ "display": timerTimeRemaining ? "block" : "none" }}>
          {timerTimeRemaining ? <Moment tz="UTC" format={timerTimeRemaining > 3600 ? "HH·mm·ss" : "mm·ss"} date={new Date(timerTimeRemaining * 1000)}></Moment> : null}
        </div>
      </Zoom>
      <audio id="timer-end"><source src="/sounds/fairy-alert.wav" /></audio>
      <audio id="timer-remove"><source src="/sounds/remove.wav" /></audio>


    </React.Fragment>
  );
}

export default Clock

