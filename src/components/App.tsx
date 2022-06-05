import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PieChart from './pieChart';
import BarChart from './barChart';

interface ICityDetail {
  name: string;
  weather: string;
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
  };
  weather: { description: string }[];
}

export interface ITempData {
  value: number;
  time: number;
}

interface IWeatherData {
  description: string;
  time: number;
}

const App = () => {
  dayjs.extend(utc);

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [cityDetail, setCityDetail] = useState<null | ICityDetail>(null);
  const [weatherList, setWeatherList] = useState<IWeatherData[]>([]);
  const [tempMax, setTempMax] = useState<ITempData[]>([]);
  const [tempMin, setTempMin] = useState<ITempData[]>([]);
  const [humidity, setHumidity] = useState<null | number>(null);
  const [utcTime, setUtcTime] = useState<number>(8);

  const [currentMaxTemp, setCurrentMaxTemp] = useState<string>('');
  const [currentMinTemp, setCurrentMinTemp] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result: string = e.target.value;
    setInputValue(result);
  };

  const handleSubmit = async () => {
    const result: string = inputValue.trim();

    setCurrentMaxTemp('');
    setCurrentMinTemp('');

    if (result !== '' && !isLoading) {
      setIsLoading(true);
      setIsError(false);

      setCityDetail(null);
      setWeatherList([]);
      setTempMax([]);
      setTempMin([]);
      setHumidity(null);
      setUtcTime(8);

      try {
        const { data } = await axios({
          method: 'get',
          url: 'https://api.openweathermap.org/data/2.5/forecast',
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

        const weathers: IWeatherData[] = data.list.map(({ dt, weather }: IDataListItem) => {
          return {
            description: weather[0].description,
            time: dt,
          };
        });

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
        setWeatherList(weathers);

        const { coord, population, sunrise, sunset, timezone } = data.city;

        setCityDetail({
          name: `${data.city.name}, ${data.city.country}`,
          weather: data.list[0].weather[0].description,
          coord,
          population,
          sunrise,
          sunset,
          time: data.list[0].dt,
        });

        setUtcTime(timezone / 3600);

        setInputValue('');
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
        setIsLoading(false);
      }
    }
  };

  const formatTime = useCallback((time: number, format?: string): string => {
    const _format = format ? format : 'YYYY/MM/DD HH:mm';
    return dayjs.unix(time).utcOffset(utcTime).format(_format);
  }, [utcTime]);

  const formatCurrency = (value: number) => {
    let result = value.toString();
    const reg = /(-?\d+)(\d{3})/;
    while (reg.test(result)) {
      result = result.replace(reg, '$1,$2');
    }
    return result;
  };

  const classDefines = 'tw-w-1/5 tw-px-2.5 tw-leading-relaxed tw-align-middle tw-text-center tw-border tw-border-gray-light tw-border-solid tw-text-xs';

  return (
    <div className="tw-w-full tw-max-w-2xl tw-m-auto">
      <h1 className="before-font-material before:tw-content-['\e2bd'] before:tw-text-4xl desktop:before:tw-text-5xl before:tw-mr-3 tw-my-4 tw-text-3xl desktop:tw-text-4xl tw-font-bold tw-flex tw-items-center tw-justify-center">Weather APP</h1>
      <div className={`tw-w-full tw-flex tw-items-center tw-my-8 ${ isLoading ? 'tw-opacity-60 tw-select-none' : '' }`}>
        <input
          type="text"
          className="tw-w-full tw-py-2 tw-px-3 tw-rounded-md tw-bg-white tw-leading-6 tw-flex-grow tw-basis-0 tw-appearance-none tw-tracking-wide tw-text-base"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search City"
        />
        <button
          type="button"
          className="tw-bg-black tw-text-white tw-py-2 tw-px-3 tw-ml-3 tw-rounded-md tw-leading-6 tw-text-base"
          onClick={handleSubmit}
        >Submit</button>
      </div>

      {
        !isLoading && !isError && cityDetail !== null && (
          <section className="tw-p-3 mobile:tw-p-4 desktop:tw-p-5 tw-rounded-md tw-bg-white">
            <div className="desktop:tw-flex desktop:tw-justify-between tw-mb-5">
              <div className="desktop:tw-flex-grow desktop:tw-basis-0 desktop:tw-pr-5">
                <h2 className="tw-text-2xl desktop:tw-text-3xl tw-font-bold tw-break-words tw-mb-4">{ cityDetail.name }</h2>
                <div className="tw-p-3 tw-rounded-md tw-bg-gray-light">
                  <ul>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Time: </strong>{ formatTime(cityDetail.time) }
                    </li>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Weather: </strong>{ cityDetail.weather }
                    </li>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Latitude: </strong>{ cityDetail.coord.lat }
                    </li>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Longitude: </strong>{ cityDetail.coord.lon }
                    </li>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Population: </strong>{ formatCurrency(cityDetail.population) }
                    </li>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Sunrise: </strong>{ formatTime(cityDetail.sunrise, 'HH:mm') }
                    </li>
                    <li className="tw-text-base tw-leading-7 tw-font-bold">
                      <strong>Sunset: </strong>{ formatTime(cityDetail.sunset, 'HH:mm') }
                    </li>
                  </ul>
                </div>
              </div>
              {
                humidity !== null && (
                  <div className="tw-w-52 tw-mx-auto tw-my-5 desktop:tw-mx-0 desktop:tw-my-0">
                    <PieChart amount={humidity} />
                    <div className="tw-text-center tw-text-xl tw-font-bold tw-mt-3 tw-mb-1">Humidity</div>
                    {/* <div className="tw-text-center tw-text-md tw-font-bold">
                      { formatTime(cityDetail.time) }
                    </div> */}
                  </div>
                )
              }
            </div>

            <div className="tw-w-full tw-my-5 tw-overflow-x-auto tw-overflow-y-hidden tw-rounded-md">
              <table className="tw-w-full">
                <thead>
                  <tr className="tw-bg-black">
                    {
                      weatherList.map(({ time }) => {
                        return (
                          <th key={uuidv4()} className={`${classDefines} tw-py-2 tw-text-white tw-leading-4`}>
                            <div>{ formatTime(time, 'YYYY/MM/DD') }</div>
                            <div>{ formatTime(time, 'HH:mm') }</div>
                          </th>
                        );
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {
                      weatherList.map(({ description }) => {
                        return (
                          <td key={uuidv4()} className={`${classDefines} tw-py-3`}>
                            <span>{ description }</span>
                          </td>
                        );
                      })
                    }
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="desktop:tw-flex desktop:tw-justify-between">
              <div className="tw-mb-3 tw-pt-7 tw-relative desktop:tw-mb-0">
                <div className="tw-hidden tw-w-full tw-absolute tw-left-0 tw-top-0 real-desktop:tw-flex tw-justify-center tw-items-center">
                  {
                    currentMaxTemp !== '' &&
                    (<span className="tw-inline-block tw-py-0.5 tw-px-2 tw-text-xs tw-bg-gray-dark tw-text-white tw-rounded-md">{ currentMaxTemp }</span>)
                  }
                </div>
                <div onMouseLeave={() => setCurrentMaxTemp('')}>
                  <BarChart amount={tempMax} utcTime={utcTime} onSetCurrent={setCurrentMaxTemp} />
                </div>
                <div className="tw-text-center tw-text-xl tw-font-bold tw-mt-4 tw-mb-1">Max Temperature (°C)</div>
                <div className="real-desktop:tw-hidden tw-text-center tw-text-sm tw-font-bold">
                  { formatTime(tempMax[0].time) } ~ { formatTime(tempMax[tempMax.length - 1].time) }
                </div>
              </div>

              <div className="tw-mb-3 tw-pt-7 tw-relative desktop:tw-mb-0">
                <div className="tw-hidden tw-w-full tw-absolute tw-left-0 tw-top-0 real-desktop:tw-flex tw-justify-center tw-items-center">
                  {
                    currentMinTemp !== '' &&
                    (<span className="tw-inline-block tw-py-0.5 tw-px-2 tw-text-xs tw-bg-gray-dark tw-text-white tw-rounded-md">{ currentMinTemp }</span>)
                  }
                </div>
                <div onMouseLeave={() => setCurrentMinTemp('')}>
                  <BarChart amount={tempMin} utcTime={utcTime} onSetCurrent={setCurrentMinTemp} />
                </div>
                <div className="tw-text-center tw-text-xl tw-font-bold tw-mt-4 tw-mb-1">Min Temperature (°C)</div>
                <div className="real-desktop:tw-hidden tw-text-center tw-text-sm tw-font-bold">
                  { formatTime(tempMin[0].time) } ~ { formatTime(tempMin[tempMin.length - 1].time) }
                </div>
              </div>
            </div>

            <div className="tw-mt-10 tw-text-sm tw-font-bold tw-text-gray-dark tw-text-center">All of time use UTC {utcTime > 0 ? `+${utcTime}` : utcTime}  time zone.</div>
          </section>
        )
      }

      {
        !isLoading && isError && (
          <div className="tw-text-gray-dark tw-text-center tw-text-2xl tw-font-bold tw-break-words tw-my-20">No Result</div>
        )
      }

      {
        isLoading && !isError && (
          <div className="tw-text-gray-dark tw-text-center tw-my-20">
            <div className="tw-flex tw-items-center tw-justify-center">
              <span className="bouncing-animation tw-w-4 tw-h-4 tw-block tw-my-8 tw-mx-1 tw-bg-gray-dark tw-rounded-full" />
              <span className="bouncing-animation bouncing-animation_delay-2 tw-w-4 tw-h-4 tw-block tw-my-8 tw-mx-1 tw-bg-gray-dark tw-rounded-full" />
              <span className="bouncing-animation bouncing-animation_delay-4 tw-w-4 tw-h-4 tw-block tw-my-8 tw-mx-1 tw-bg-gray-dark tw-rounded-full" />
            </div>
            <div className="tw-text-2xl tw-font-bold tw-break-words">Loading...</div>
          </div>
        )
      }
    </div>
  );
};

export default App;
