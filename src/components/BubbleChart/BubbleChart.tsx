import { Scatter } from "@ant-design/charts";
import { IChartWithData } from "../../interfaces/IChart";
import parseFunction from "../../utils/Utils";

const BubbleChart: React.FC<IChartWithData> = (props) => {
  const { xField, yField, javascriptFunction, data } = props;
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
  return <Scatter data={dataToBeAdded()} xField={xField} yField={yField} />;
};
export default BubbleChart;
