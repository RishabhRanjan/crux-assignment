export enum chartTypeEnum {
  LINE = "lineChart",
  BAR = "barChart",
  HEATMAP = "heatMap",
  BUBBLE = "bubbleChart",
  PIE = "pieChart",
  MULTI_BAR = "multiBar",
  MULTI_LINE = "multiLine",
}
export interface IChartWithData extends IChart {
  data: any;
}
export default interface IChart {
  title?: string;
  xField: string;
  yField: string;
  seriesField?: string;
  javascriptFunction?: string;
  chartType: chartTypeEnum;
}
