import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IBarChartProps {
  amount: number[];
}

const BarChart: React.FC<IBarChartProps> = ({ amount }) => {
  const [amountList, setAmountList] = useState<number[]>([]);

  useEffect(() => {
    const count = amount.reduce((p, c) => p + Math.abs(c), 0);
    const result = amount.map((value) => Math.floor((value / count) * 100));
    setAmountList(result);
  }, [amount]);

  return (
    <svg className="bar-chart" width="300px" height="100%" y="0px" x="0px">
      {
        amountList.map((value, index) => {
          const id: string = uuidv4();
          return (
            <g key={id}>
              <rect
                className="bar-chart__column"
                width="50px"
                height={`${value}%`}
                y={`${100 - value}%`}
                x={`${(50 + 12.5) * index}px`}
              ></rect>
              <text
                x={`${(50 + 12.5) * index + 25}px`}
                y={`${100 - value}%`}
                fill="#35495e"
                alignmentBaseline="central"
                textAnchor="middle"
              >{ value }</text>
            </g>
          );
        })
      }
    </svg>
  );
};

export default BarChart;