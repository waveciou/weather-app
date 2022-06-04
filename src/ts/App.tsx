import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import PieChart from '@/TypeScript/pieChart';
import BarChart from '@/TypeScript/barChart';

interface ICityDetail {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  population: number;
  sunrise: number;
  sunset: number;
  time: number;
}

interface IDataListItem {
  dt: number;
  main: {
    temp_max: number;
    temp_min: number;
    humidity: number;
  }
}

export interface ITempData {
  value: number;
  time: number;
}

const App = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [tempMax, setTempMax] = useState<ITempData[]>([]);
  const [tempMin, setTempMin] = useState<ITempData[]>([]);
  const [humidity, setHumidity] = useState<null | number>(null);

  const [cityDetail, setCityDetail] = useState<null | ICityDetail>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result: string = e.target.value;
    setInputValue(result);
  };

  const handleSubmit = async () => {
    const result: string = inputValue.trim();

    if (result !== '' && !isLoading) {
      setIsLoading(true);
      setIsError(false);

      setCityDetail(null);
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

        console.log(data);

        const max: ITempData[] = data.list.map(({ dt, main }: IDataListItem) => {
          return {
            value: main.temp_max,
            time: dt,
          };
        });

        const min: ITempData[] = data.list.map(({ dt, main }: IDataListItem) => {
          return {
            value: main.temp_min,
            time: dt,
          };
        });

        setTempMax(max);
        setTempMin(min);
        setHumidity(data.list[0].main.humidity);

        const { coord, population, sunrise, sunset } = data.city;

        setCityDetail({
          name: `${data.city.name}, ${data.city.country}`,
          coord,
          population,
          sunrise,
          sunset,
          time: data.list[0].dt,
        });

        setInputValue('');
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
        !isLoading && !isError && cityDetail !== null && (
          <section className="tw-p-5 tw-rounded-md tw-bg-white">
            <div className="tw-flex tw-justify-between tw-mb-5">
              <div className="tw-flex-grow tw-basis-0">
                <h2 className="tw-text-3xl tw-font-bold tw-break-words">{ cityDetail.name }</h2>
              </div>
              {
                humidity !== null && (
                  <div className="tw-w-52">
                    <PieChart amount={humidity} />
                    <div className="tw-text-center tw-text-xl tw-font-bold tw-mt-3 tw-mb-1">Humidity</div>
                    <div className="tw-text-center tw-text-md tw-font-bold">
                      { dayjs.unix(cityDetail.time).format('YYYY/MM/DD HH:MM') }
                    </div>
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
