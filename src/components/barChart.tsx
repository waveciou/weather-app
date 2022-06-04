import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ITempData } from './App';

interface IBarChartProps {
  amount: ITempData[];
  utcTime: number;
  onSetCurrent: (time: string) => void;
}

interface IAmountData {
  value: number;
  percent: number;
  time: number;
}

const BarChart: React.FC<IBarChartProps> = ({ amount, utcTime, onSetCurrent }) => {
  dayjs.extend(utc);

  const [amountList, setAmountList] = useState<IAmountData[]>([]);

  useEffect(() => {
    const _amount: number[] = amount.map(({ value }) => value);
    const max: number = Math.max(..._amount) * 100;
    const min: number = Math.min(..._amount) * 100;
    const range: number = max - min;

    const result: IAmountData[] = amount.map(({ value, time }) => {
      const formatValue = value * 100;
      let percent = 100;

      if (formatValue === max) {
        percent = 100;
      } else if (formatValue === min) {
        percent = 10;
      } else {
        const _percent: number = ((formatValue - min) / range * 100);
        percent = _percent > 90 ? _percent : 10 + _percent;
      }

      return { value, percent, time };
    });

    setAmountList(result);
  }, [amount]);

  return (
    <>
      <svg
        className="bar-chart" width="290px" height="200px" y="0px" x="0px"
        onMouseLeave={() => onSetCurrent('')}
      >
        {
          amountList.map(({ value, percent, time }, index: number) => {
            const id: string = uuidv4();
            return (
              <g
                key={id}
                onMouseEnter={() => {
                  const formatTime: string = dayjs.unix(time).utcOffset(utcTime).format('YYYY/MM/DD HH:MM');
                  onSetCurrent(formatTime);
                }}
                onMouseLeave={() => onSetCurrent('')}
              >
                <rect
                  className="bar-chart__column"
                  width="50px"
                  height={`${percent}%`}
                  y={`${100 - percent}%`}
                  x={`${(50 + 10) * index}px`}
                  rx="6"
                ></rect>
                <text
                  className="bar-chart__text"
                  x={`${(50 + 10) * index + 25}px`}
                  y={`${104 - percent}%`}
                  fill="#ffffff"
                  alignmentBaseline="central"
                  textAnchor="middle"
                  fontSize="12"
                >{ value }</text>
              </g>
            );
          })
        }
      </svg>
      <svg className="bar-chart-time" width="290px" height="20px">
        {
          amountList.map(({ time }, index: number) => {
            const id: string = uuidv4();
            return (
              <g key={id}>
                <text
                  x={`${(50 + 10) * index + 25}px`}
                  y="10px"
                  fill="#000"
                  alignmentBaseline="central"
                  textAnchor="middle"
                  fontSize="12"
                >{ dayjs.unix(time).utcOffset(utcTime).format('HH:MM') }</text>
              </g>
            );
          })
        }
      </svg>
    </>
  );
};

export default BarChart;