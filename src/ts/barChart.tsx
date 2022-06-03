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
    const max: number = Math.max(...amount) * 100;
    const min: number = Math.min(...amount) * 100;
    const range: number = max - min;

    const result: IAmountData[] = amount.map((_value) => {
      const value = _value * 100;
      let percent = 100;

      if (value === max) {
        percent = 100;
      } else if (value === min) {
        percent = 10;
      } else {
        percent = 10 + ((value - min) / range * 100);
      }

      return { value: _value, percent };
    });

    console.log(result);

    setAmountList(result);
  }, [amount]);

  return (
    <svg className="bar-chart" width="290px" height="100%" y="0px" x="0px">
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
                x={`${(50 + 10) * index}px`}
                rx="6"
              ></rect>
              <text
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
  );
};

export default BarChart;