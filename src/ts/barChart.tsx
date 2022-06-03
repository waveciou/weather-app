import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IBarChartProps {
  amount: number[];
}

interface IAmountData {
  value: number;
  percent: number;
}

const BarChart: React.FC<IBarChartProps> = ({ amount }) => {
  const [amountList, setAmountList] = useState<IAmountData[]>([]);

  useEffect(() => {
    const max: number = Math.max(...amount);
    const min: number = Math.min(...amount);
    const range: number = max - min;

    const result: IAmountData[] = amount.map((value) => {
      let percent = 100;

      if (value === max) {
        percent = 90;
      } else if (value === min) {
        percent = 10;
      } else {
        percent = (value - min) / range * 100;
      }

      return { value: Math.floor(value), percent };
    });

    setAmountList(result);
  }, [amount]);

  return (
    <svg className="bar-chart" width="300px" height="100%" y="0px" x="0px">
      {
        amountList.map(({ value, percent }, index: number) => {
          const id: string = uuidv4();
          return (
            <g key={id}>
              <rect
                className="bar-chart__column"
                width="50px"
                height={`${percent}%`}
                y={`${100 - percent}%`}
                x={`${(50 + 12) * index}px`}
              ></rect>
              <text
                x={`${(50 + 12) * index + 25}px`}
                y={`${104 - percent}%`}
                fill="#ffffff"
                alignmentBaseline="central"
                textAnchor="middle"
                fontSize="14"
              >{ value }</text>
            </g>
          );
        })
      }
    </svg>
  );
};

export default BarChart;