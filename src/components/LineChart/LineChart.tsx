import { Line } from "@ant-design/charts";
import { chartTypeEnum, IChartWithData } from "../../interfaces/IChart";
import parseFunction from "../../utils/Utils";

const LineChart: React.FC<IChartWithData> = (props) => {
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
    <Line
      isStack={chartType === chartTypeEnum.MULTI_LINE}
      data={dataToBeAdded()}
      xField={xField}
      yField={yField}
      seriesField={
        chartType === chartTypeEnum.MULTI_LINE ? seriesField : undefined
      }
      xAxis={{ title: { text: xField } }}
      yAxis={{ title: { text: yField } }}
      style={{ backgroundColor: "white" }}
    />
  );
};
export default LineChart;
