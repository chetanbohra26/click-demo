import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [maxInterval, setMaxInterval] = useState(5000);
  const [shouldRun, setShouldRun] = useState(false);
  const [pos, setPos] = useState([0, 0]);
  const [lastTime, setLastTime] = useState();

  // start board with a random
  useEffect(() => {
    randPos();
  }, []);

  // Initial timer update
  useEffect(() => {
    if (shouldRun) {
      setLastTime(Date.now());
    }
  }, [shouldRun]);

  // reset timer once result is updated
  useEffect(() => {
    setLastTime(Date.now());
  }, [results]);

  //reset results if interval is changed
  useEffect(() => {
    setResults([]);
  }, [maxInterval]);

  // setInterval to continue changing positions every 'maxInterval' seconds
  useEffect(() => {
    if (maxInterval <= 0 || Number.isNaN(maxInterval) || !shouldRun) return () => { };
    const intv = setInterval(() => {
      randPos()
    }, maxInterval);

    return () => clearInterval(intv);
  }, [maxInterval, shouldRun, results]);

  const handleLog = (time) => {
    const res = [...results, { id: results.length + 1, time }];
    setResults(res);
  }

  const handleTargetClick = () => {
    const time = Date.now();
    console.log(time, lastTime);
    const diff = time - lastTime;
    console.log("diff", diff);
    handleLog(diff / 1000);
    randPos();
  }

  const randPos = () => {
    setPos([Math.random() * 350, Math.random() * 350,]);
  }

  const handleStart = () => {
    setShouldRun(true);
  }

  const handlePause = () => {
    setShouldRun(false);
  }

  const handleReset = () => {
    setShouldRun(false);
    setResults([]);
  }

  return (
    <div className="container">

      <div className='btn-area'>
        <input type="number"
          placeholder='Enter value'
          onChange={(e) => { setMaxInterval(e.target.value * 1000) }} />
        <button onClick={() => handleStart()}>START</button>
        <button onClick={() => handlePause()}>PAUSE</button>
        <button onClick={() => handleReset()}>RESET</button>
      </div>

      <div className='click-area'>
        {
          shouldRun &&
          <div
            className='target-box'
            style={{ top: pos[0] || 0, left: pos[1] || 0 }}
            onClick={() => { handleTargetClick() }}
          />
        }
      </div>

      <div className='results-area'>
        <table border="1px solid black">
          <thead>
            <tr>
              <th>Mouse click number</th><th>Reaction time</th>
            </tr>
          </thead>
          <tbody>
            {
              results?.map(res =>
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{res.time}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
