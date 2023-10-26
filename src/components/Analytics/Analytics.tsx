import { useState } from "react";
import IChart, { chartTypeEnum } from "../../interfaces/IChart";
import { Radio, Table, Avatar, Modal, Input, Badge } from "antd";
import {
  LineChartOutlined,
  PieChartFilled,
  DotChartOutlined,
  BarChartOutlined,
  HeatMapOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  MessageOutlined,
  MessageFilled,
} from "@ant-design/icons";
import type { PaginationProps } from "antd";
import Charts from "../Charts/Charts";
import styles from "./Analytics.module.css";
import { feedbackAction } from "../../interfaces/IChat";
import ApiEndpoint from "../../constants/ApiUrls";

interface Props {
  chartList: IChart[];
  data: Object;
  heading: string;
  uuid: string;
  liked: number;
  feedback: string;
  date: string;
  hid: string;
}
const ICON_MAP = new Map([
  [chartTypeEnum.BAR, <BarChartOutlined />],
  [chartTypeEnum.BUBBLE, <DotChartOutlined />],
  [chartTypeEnum.HEATMAP, <HeatMapOutlined />],
  [chartTypeEnum.LINE, <LineChartOutlined />],
  [chartTypeEnum.PIE, <PieChartFilled />],
]);
export default function Analytics(props: Props) {
  const { chartList, data, heading, uuid, liked, feedback, date, hid } = props;
  const [chart, setChart] = useState(0);
  const [localLike, setLocalLike] = useState(liked);
  const [localFeedback, setLocalFeedback] = useState(feedback);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [chartType, setChartType] = useState<chartTypeEnum>(
    chartList[0].chartType
  );

  const itemRender: PaginationProps["itemRender"] = (
    page,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return (
        <span>
          <ArrowLeftOutlined />
          &nbsp; Previous
        </span>
      );
    }
    if (type === "next") {
      return (
        <span>
          Next &nbsp;
          <ArrowRightOutlined />
        </span>
      );
    }
    return originalElement;
  };
  const chartTypeMap: Map<chartTypeEnum, IChart[]> = chartList.reduce(
    (map, chart) => {
      // Ensure chart.chartType is defined
      if (!map.has(chart.chartType)) {
        map.set(chart.chartType, []);
      }
      if (map !== undefined) {
        (map.get(chart.chartType) as IChart[]).push(chart);
      }

      return map;
    },
    new Map<chartTypeEnum, IChart[]>()
  );

  const chartTypeOptions = [...chartTypeMap.keys()].map(
    (ele: chartTypeEnum) => {
      return { label: ICON_MAP.get(ele), value: ele };
    }
  );

  const chartOptions = (chartTypeMap.get(chartType) as IChart[]).map(
    (ele, idx) => {
      return { label: ele.title, value: idx };
    }
  );
  const getTableColumns = () => {
    const tableColumns = [
      {
        title: (chartTypeMap.get(chartType) as IChart[])[chart][
          "xField"
        ].toUpperCase(),
        dataIndex: (chartTypeMap.get(chartType) as IChart[])[chart]["xField"],
        key: (chartTypeMap.get(chartType) as IChart[])[chart]["xField"],
      },
      {
        title: (chartTypeMap.get(chartType) as IChart[])[chart][
          "yField"
        ].toUpperCase(),
        dataIndex: (chartTypeMap.get(chartType) as IChart[])[chart]["yField"],
        key: (chartTypeMap.get(chartType) as IChart[])[chart]["yField"],
      },
    ];
    if (
      (chartTypeMap.get(chartType) as IChart[])[chart]?.seriesField !==
      undefined
    ) {
      let newVal =
        (chartTypeMap.get(chartType) as IChart[])[chart]?.seriesField ?? null;
      if (newVal) {
        const seriesField = (chartTypeMap.get(chartType) as IChart[])[chart]
          ?.seriesField;
        if (seriesField) {
          tableColumns.push({
            title: seriesField.toUpperCase(),
            dataIndex: seriesField,
            key: seriesField,
          });
        }
      }
    }
    return tableColumns;
  };

  async function sendFeedback(type: feedbackAction, value: string) {
    const body = new FormData();
    body.append("hid", hid);
    body.append("date", date);
    body.append("chatId", uuid);
    body.append("value", value);
    body.append("action", type);
    fetch(ApiEndpoint.feedback, { method: "POST", body })
      .then((res) => console.log("succesfull"))
      .catch((e) => console.log(e));
  }

  function handleChartTypeChange(value: chartTypeEnum) {
    setChartType(value);
    setChart(0);
  }
  function handleChartChange(value: number) {
    setChart(value);
  }

  function handleLike() {
    if (localLike === 1) {
      setLocalLike(0);
      sendFeedback(feedbackAction.LIKED, String(0));
      return;
    }
    setLocalLike(1);
    sendFeedback(feedbackAction.LIKED, String(1));
  }

  function handleDisLike() {
    if (localLike === -1) {
      setLocalLike(0);
      sendFeedback(feedbackAction.LIKED, String(0));
      return;
    }
    setLocalLike(-1);
    sendFeedback(feedbackAction.LIKED, String(-1));
  }

  return (
    <div className={styles.chartBoundary}>
      <div className={styles.title}>
        <div className={styles.label}>{heading}</div>
        <div className={styles.actions}>
          <Avatar
            onClick={handleLike}
            size="small"
            shape="square"
            className={styles.avatar}
          >
            <Badge dot={localLike === 1}>
              {localLike === 1 ? <LikeFilled /> : <LikeOutlined />}
            </Badge>
          </Avatar>
          <Avatar
            size="small"
            onClick={handleDisLike}
            shape="square"
            className={styles.avatar}
          >
            <Badge dot={localLike === -1}>
              {localLike === -1 ? <DislikeFilled /> : <DislikeOutlined />}
            </Badge>
          </Avatar>
          <Avatar
            size="small"
            shape="square"
            className={styles.avatar}
            onClick={() => setIsFeedbackModalOpen(true)}
          >
            <Badge dot={localFeedback.length > 0}>
              {localFeedback.length > 0 ? (
                <MessageFilled />
              ) : (
                <MessageOutlined />
              )}
            </Badge>
          </Avatar>
        </div>
      </div>
      <Table
        columns={getTableColumns()}
        dataSource={data as any}
        pagination={{ itemRender: itemRender }}
      />
      <div className={styles.title}>
        <span className={styles.label}>Channel</span>
      </div>
      <div className={styles.navigateWrap}>
        <Radio.Group
          options={chartOptions}
          value={chart}
          onChange={(e) => handleChartChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="small"
          className={styles.radioGrp}
        />
        <Radio.Group
          options={chartTypeOptions}
          value={chartType}
          onChange={(e) => handleChartTypeChange(e.target.value)}
          buttonStyle="solid"
          optionType="button"
          size="small"
        />
      </div>
      <Charts
        config={(chartTypeMap.get(chartType) as IChart[])[chart]}
        data={data}
      />
      <Modal
        title={"Give feedback"}
        open={isFeedbackModalOpen}
        onCancel={() => {
          setIsFeedbackModalOpen(false);
        }}
        onOk={() => {
          setIsFeedbackModalOpen(false);
          sendFeedback(feedbackAction.FEEDBACK, localFeedback);
        }}
      >
        <p>What do you think of the results generated ?</p>
        <Input
          onChange={(e) => setLocalFeedback(e.target.value)}
          value={localFeedback}
        />
      </Modal>
    </div>
  );
}
