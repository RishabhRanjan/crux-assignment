import { Bar } from "@ant-design/charts";
import { IChartWithData, chartTypeEnum } from "../../interfaces/IChart";
import parseFunction from "../../utils/Utils";

const BarChart: React.FC<IChartWithData> = (props) => {
  const { chartType, xField, yField, seriesField, javascriptFunction, data } =
    props;

  const generatingFunction = parseFunction(
    javascriptFunction as string,
    (data: any) => data
  );

  const dataToBeAdded = () => {
    if (typeof generatingFunction === "function") {
      return generatingFunction(data);
    }
    return null;
  };
  return (
    <Bar
      data={dataToBeAdded()}
      isStack={chartType === chartTypeEnum.MULTI_BAR}
      xField={xField}
      yField={yField}
      seriesField={
        chartType === chartTypeEnum.MULTI_BAR ? seriesField : undefined
      }
    />
  );
};
export default BarChart;
