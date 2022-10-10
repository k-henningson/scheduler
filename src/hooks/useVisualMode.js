import { useState } from 'react';

export default function useVisualMode(initial) {
  //initial passed in is mode which is FIRST
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //newMode passed into transition and set
  function transition(newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  };

  function back() {
    if (history.length >= 1) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  } ;
  
  
  //exposing way to update state whenever user wants, because transition calls setMode 
  return { mode, transition, back };

};
