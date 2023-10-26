import styles from "./EmptyState.module.css";
import { CloudUploadOutlined } from "@ant-design/icons";

interface Props {
  onUpload: (e: any) => void;
  onError: (e: string) => void;
}
export default function EmptyState({ onUpload, onError }: Props) {
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FormData();
    const headers = new Headers();
    headers.append("content-type", "multipart/form-data");
    if (!e.target.files) return;
    const file = e?.target.files[0];
    const fileName = file.name.split(".").pop();
    if (fileName !== "csv") {
      onError("Only CSV files are accepted");
    }
    data.append("file", file);
    data.append("uid", "1");
    fetch("http://localhost:8080/new-chat", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        onUpload(data);
      })
      .catch((e) => onError(`Unable to create new chat. ${e}`));
  };
  return (
    <div className={styles.wrapper}>
      <p>Please upload the csv file here, to start interacting</p>
      <label htmlFor="upload-csv" className={styles.uploadBtn}>
        <CloudUploadOutlined />
        Upload File
      </label>
      <input
        type="file"
        id="upload-csv"
        style={{ opacity: 0 }}
        accept=".csv"
        onChange={handleCsvUpload}
      />
    </div>
  );
}
