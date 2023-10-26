import classNames from "classnames";
import styles from "./Chat.module.css";
import { DateTime } from "luxon";
import { chatType, roleTYPE } from "../../interfaces/IChat";
import { Button, Skeleton, Tooltip } from "antd";
import { BarChartOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Charts from "../Charts/Charts";
import IChart from "../../interfaces/IChart";
import Analytics from "../Analytics/Analytics";

interface Props {
  time: string;
  author: string;
  type: chatType;
  uuid: string;
  liked: number;
  feedback: string;
  date: string;
  csv: { filename: string; data: string };
  message: any;
  hid: string;
}
export const Chat = ({
  time,
  author,
  message,
  type,
  csv,
  uuid,
  liked,
  feedback,
  date,
  hid,
}: Props) => {
  const getTime = () => {
    const currTime = DateTime.now();
    const qTime = DateTime.fromMillis(+time);
    if (currTime.diff(qTime).as("milliseconds") < 6000) {
      return "Just now";
    }
    return DateTime.fromMillis(+time).toFormat("hh:mm a");
  };

  const getMessageContent = () => {
    if (type === chatType.loading) {
      return (
        <Skeleton.Node active>
          <BarChartOutlined style={{ fontSize: 40, color: "#f9fafb" }} />
        </Skeleton.Node>
      );
    }
    if (type === chatType.chart && message) {
      return (
        <Analytics
          hid={hid}
          date={date}
          data={csv.data}
          chartList={message.charts}
          heading={message.heading}
          uuid={uuid}
          liked={liked}
          feedback={feedback}
        />
      );
    }
    if (type === chatType.csvUpload) {
      return (
        <div className={styles.centerFlex}>
          <div>
            Thank you for uploading the data. Now you can start asking
            questions.
          </div>
          <Tooltip title={csv.filename}>
            <Button
              icon={<CloudUploadOutlined />}
              type="primary"
              className={styles.uploadBtn}
            >
              {csv.filename}
            </Button>
          </Tooltip>
        </div>
      );
    }
    return message;
  };
  return (
    <div
      className={classNames(
        styles.chatWrap,
        {
          [styles.rightAlign]: author === roleTYPE.HUMAN,
        },
        { [styles.chart]: type === chatType.chart }
      )}
    >
      <div className={styles.info}>
        <span>{author === roleTYPE.HUMAN ? "You" : author.toLowerCase()}</span>
        <span className={styles.infoTime}>{getTime()}</span>
      </div>
      <div
        className={classNames(
          styles.bubble,
          {
            [styles.self]: author === roleTYPE.HUMAN,
          },
          { [styles.chartBubble]: type === chatType.chart }
        )}
      >
        {getMessageContent()}
      </div>
    </div>
  );
};

export default Chat;
