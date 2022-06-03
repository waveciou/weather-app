import React, { useState } from 'react';
import axios from 'axios';
import PieChart from '@/TypeScript/pieChart';
import BarChart from '@/TypeScript/barChart';

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
  const [isError, setIsError] = useState<boolean>(false);

  const [tempMax, setTempMax] = useState<number[]>([]);
  const [tempMin, setTempMin] = useState<number[]>([]);
  const [humidity, setHumidity] = useState<null | number>(null);

  const [cityName, setCityName] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result: string = e.target.value;
    setInputValue(result);
  };

  const handleSubmit = async () => {
    const result: string = inputValue.trim();

    if (result !== '' && !isLoading) {
      setIsLoading(true);
      setIsError(false);

      setCityName('');
      setTempMax([]);
      setTempMin([]);
      setHumidity(null);

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

        const max = data.list.map(({ main }: IDataListItem) => main.temp_max);
        const min = data.list.map(({ main }: IDataListItem) => main.temp_min);
        const hum = data.list.pop().main.humidity;

        setTempMax(max);
        setTempMin(min);
        setHumidity(hum);

        setCityName(`${data.city.name}, ${data.city.country}`);
        setInputValue('');

        console.log(data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="tw-w-full tw-max-w-2xl tw-m-auto">
      <h1 className="tw-my-4 tw-text-center tw-text-4xl tw-font-bold">Weather APP</h1>
      <div className="tw-w-full tw-flex tw-items-center tw-my-8">
        <input
          type="text"
          className="tw-w-full tw-py-2 tw-px-3 tw-rounded-md tw-bg-white tw-leading-6 tw-flex-grow tw-basis-0 tw-appearance-none tw-tracking-wide"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search City"
        />
        <button
          type="button"
          className="tw-bg-black tw-text-white tw-py-2 tw-px-3 tw-ml-3 tw-rounded-md tw-leading-6"
          onClick={handleSubmit}
        >Submit</button>
      </div>

      {
        !isLoading && !isError && cityName !== '' && (
          <section className="tw-p-5 tw-rounded-md tw-bg-white">
            <div className="tw-flex tw-justify-between tw-mb-3">
              <div className="tw-flex-grow tw-basis-0">
                <h2 className="tw-text-3xl tw-font-bold tw-break-words">{ cityName }</h2>
              </div>
              {
                humidity !== null && (
                  <div className="tw-w-52">
                    <PieChart amount={humidity} />
                    <div className="tw-text-center tw-text-xl tw-font-bold tw-my-3">Humidity</div>
                  </div>
                )
              }
            </div>
            <div className="tw-flex tw-justify-between">
              <div>
                <BarChart amount={tempMax} />
                <div className="tw-text-center tw-text-xl tw-font-bold tw-my-3">Max Temperature</div>
              </div>
              <div>
                <BarChart amount={tempMin} />
                <div className="tw-text-center tw-text-xl tw-font-bold tw-my-3">Min Temperature</div>
              </div>
            </div>
          </section>
        )
      }

      {
        !isLoading && isError && (
          <div className="tw-text-gray-dark tw-text-center tw-text-2xl tw-font-bold tw-break-words tw-my-20">No Result</div>
        )
      }

      {
        isLoading && !isError && (<div>Loading</div>)
      }
    </div>
  );
};

export default App;
