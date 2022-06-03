import React, { useState } from 'react';
import axios from 'axios';

interface IDataListItem {
  main: {
    temp_max: number;
    temp_min: number;
    humidity: number;
  }
}

const App = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tempMax, setTempMax] = useState<number[]>([]);
  const [tempMin, setTempMin] = useState<number[]>([]);
  const [humidity, setHumidity] = useState<null | number>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result: string = e.target.value;
    setInputValue(result);
  };

  const handleSubmit = async () => {
    const result: string = inputValue.trim();
    if (result !== '') {
      setIsLoading(true);

      try {
        const { data } = await axios({
          method: 'get',
          url: 'http://api.openweathermap.org/data/2.5/forecast',
          params: {
            q: result,
            units: 'metric',
            lang: 'zh_tw',
            cnt: '5',
            mode: 'json',
            appid: '48f427056d4654fc05c05c1e61a36c47'
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        data.list.forEach((item: IDataListItem, index: number) => {
          const { temp_max = 0 , temp_min = 0, humidity = 0 } = item.main;

          const _temp_Max: number[] = [...tempMax, temp_max];
          const _temp_Min: number[] = [...tempMin, temp_min];

          setTempMax(_temp_Max);
          setTempMin(_temp_Min);

          if (index === 0) {
            setHumidity(humidity);
          }
        });

        console.log(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <h1>Weather APP</h1>
      <div>
        <input type="text" onChange={handleChange} />
        <button type="button" onClick={handleSubmit}>Submit</button>
      </div>

      {
        isLoading && <div>Loading</div>
      }
    </div>
  );
};

export default App;
