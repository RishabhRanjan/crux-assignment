import BarChart from "../BarChart/BarChart";
import LineChart from "../LineChart/LineChart";
import HeatMap from "../HeatMap/HeatMap";
import PieChart from "../PieChart/PieChart";
import BubbleChart from "../BubbleChart/BubbleChart";
import IChart, { IChartWithData, chartTypeEnum } from "../../interfaces/IChart";

interface Props {
  config: IChart;
  data: Object;
}

export default function Charts({ config, data }: Props) {
  const { chartType, xField, yField, seriesField, javascriptFunction } = config;

  const chartUsed: { [key: string]: React.FC<IChartWithData> } = {
    [chartTypeEnum.LINE]: LineChart,
    [chartTypeEnum.BAR]: BarChart,
    [chartTypeEnum.HEATMAP]: HeatMap,
    [chartTypeEnum.PIE]: PieChart,
    [chartTypeEnum.MULTI_LINE]: LineChart,
    [chartTypeEnum.MULTI_BAR]: BarChart,
    [chartTypeEnum.BUBBLE]: BubbleChart,
  };
  const ChartComponent = chartUsed[chartType];
  return (
    <ChartComponent
      data={data}
      chartType={chartType}
      xField={xField}
      yField={yField}
      seriesField={seriesField}
      javascriptFunction={javascriptFunction}
    />
  );
}
