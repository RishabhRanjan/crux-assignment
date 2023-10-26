import React from "react";
import { Button, Popconfirm, notification } from "antd";
import {
  ArrowRightOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import reverseIcon from "../../assets/icn-chevrons-reverse.svg";
import styles from "./Home.module.css";
import logo from "../../assets/logo.svg";
import classNames from "classnames";
import { ReactElement, useEffect, useState } from "react";
import { DateTime } from "luxon";
import Chat from "../../components/Chat/Chat";
import EmptyState from "../../components/EmptyState/EmptyState";
import IChatList, {
  IChat,
  IChatMenu,
  IChatBlock,
  chatType,
  roleTYPE,
} from "../../interfaces/IChat";
import ApiEndpoint from "../../constants/ApiUrls";

export default function Home() {
  const [api, contextHolder] = notification.useNotification();
  const [selectedChat, setSelectedChat] = useState<IChatMenu>({ id: "-1" });
  const [chatItems, setChatItems] = useState<IChatMenu[]>([]);
  const [chatDetails, setChatDetails] = useState<IChatList>({} as IChatList);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<String | null>(null);
  const [query, setQuery] = useState<string>("");
  type NotificationType = "success" | "info" | "warning" | "error";
  const userId = 1;

  useEffect(() => {
    fetchChats((data) => setChatItems(data));
  }, []);

  const openNotification = (
    type: NotificationType,
    msg: string,
    desc: string
  ) => {
    api[type]({
      message: msg,
      description: desc,
      placement: "topRight",
    });
  };

  function addLoadingValues(query: string) {
    const newChatDetails = { ...chatDetails };
    const curr = DateTime.now();
    newChatDetails.history = JSON.parse(
      newChatDetails.history as unknown as string
    ) as IChatBlock[];
    const insertIndex = newChatDetails.history.findIndex((val) => {
      return curr.hasSame(DateTime.fromMillis(+val.date), "day");
    });
    if (insertIndex !== -1) {
      newChatDetails.history[insertIndex].thread.push({
        time: `${DateTime.now().toMillis()}`,
        type: chatType.query,
        role: roleTYPE.HUMAN,
        content: query,
      } as IChat);

      newChatDetails.history[insertIndex].thread.push({
        time: `${DateTime.now().toMillis()}`,
        type: chatType.loading,
        role: roleTYPE.ASSISTANT,
        content: null,
      } as IChat);
    }
    setChatDetails(newChatDetails);
  }
  function postQuery(hid: string, query: string) {
    addLoadingValues(query);
    setQuery("");
    const data = new FormData();
    data.append("hid", hid);
    data.append("query", query);
    fetch(ApiEndpoint.ask, { method: "POST", body: data })
      .then((res) => res.json())
      .then((data) => {
        setChatDetails(data);
        console.log(data);
      })
      .catch((e) => openNotification("error", "Unable to generate chat", e));
  }

  function fetchHistory(id?: string) {
    fetch(`${ApiEndpoint.getHistory}?cid=${id ?? selectedChat.id}`)
      .then((res) => res.json())
      .then((data) => {
        setChatDetails(data);
      })
      .catch((e) =>
        openNotification("error", "Unable to fetch chat detail", e)
      );
  }

  function deleteChat(id: string) {
    fetch(`${ApiEndpoint.deleteChat}?cid=${id}`).then(() => {
      openNotification("success", "Chat deleted successfully", "");
      fetchChats((data) => {
        setChatItems(data);
        setSelectedChat({ id: "-1" });
        setChatDetails({} as IChatList);
      });
    });
  }

  function fetchChats(onSuccess: (e: IChatMenu[]) => void) {
    fetch(`${ApiEndpoint.getChats}?uid=${userId}`)
      .then((res) => {
        return res.json();
      })
      .then((data: IChatMenu[]) => {
        onSuccess(data);
      })
      .catch((e) => {
        openNotification("error", "Unable to generate chat", e);
      });
  }

  function changeTitle() {
    if (!newTitle) return;
    const data = new FormData();
    data.append("cid", selectedChat.id);
    data.append("new_title", `${newTitle}`);
    fetch(ApiEndpoint.editTitle, {
      method: "POST",
      body: data,
    }).then(() => {
      setEditMode(false);
      setNewTitle(null);
      fetchChats((data) => setChatItems(data));
    });
  }

  function getDate(timestamp: string): string {
    const curr = DateTime.now();
    const fromStamp = DateTime.fromMillis(+timestamp);
    if (fromStamp.hasSame(curr, "day")) {
      return "Today";
    }
    if (fromStamp.hasSame(curr.minus({ days: 1 }), "day")) {
      return "Yesterday";
    }
    return fromStamp.toFormat("dd/MM/yy");
  }

  function getChats(chats: IChat[], csv: string, date: string) {
    console.log(chats);
    return chats.map((ele, idx) => {
      return (
        <Chat
          hid={chatDetails.id}
          date={date}
          time={ele.time}
          author={ele.role}
          message={ele.content}
          type={ele.type}
          uuid={ele.uuid}
          liked={ele.liked}
          feedback={ele.feedback}
          csv={JSON.parse(csv)}
          key={idx}
        />
      );
    });
  }

  function renderChats(currChat: IChatList): ReactElement | Array<any> {
    if (Object.keys(currChat).length) {
      const { history, csv } = currChat;
      let formattedHistory = history;
      if (typeof history === "string") {
        formattedHistory = JSON.parse(
          history as unknown as string
        ) as IChatBlock[];
      }
      if (formattedHistory.length && selectedChat.id !== "-1") {
        return formattedHistory.map((ele, idx) => {
          return (
            <>
              <div className={styles.date} key={idx}>
                <span className={styles.dateMargin}></span>
                <span className={styles.dateText}>{getDate(ele.date)}</span>
                <span className={styles.dateMargin}></span>
              </div>
              <div className={styles.chats}>
                {getChats(ele.thread, csv, ele.date)}
              </div>
            </>
          );
        });
      }
    }
    return (
      <>
        <div className={styles.date}>
          <span className={styles.dateMargin}></span>
          <span className={styles.dateText}>Today</span>
          <span className={styles.dateMargin}></span>
        </div>
        <EmptyState
          onUpload={(res): void => {
            fetchChats((data) => setChatItems(data));
            setSelectedChat(res);
            fetchHistory(res.id);
            openNotification("success", "CSV uploaded successfully", "");
          }}
          onError={(error) =>
            openNotification("error", "Unable to generate chat", error)
          }
        />
      </>
    );
  }
  return (
    <>
      <div className={styles.home}>
        {contextHolder}
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <img src={logo} alt="company-logo" />
            <span>Marketing SaaS</span>
            <img
              src={reverseIcon}
              alt="reverse"
              onClick={() =>
                openNotification("info", "Mumbai", "In the mumbai")
              }
            />
          </div>
          <div
            className={classNames(styles.menuItem, styles.newChat)}
            onClick={() => {
              setSelectedChat({ id: "-1" });
            }}
          >
            <PlusOutlined />
            <span>New chat</span>
          </div>
          <div className={styles.menuContainer}>
            {chatItems.map((ele, idx) => {
              return (
                <div
                  key={idx}
                  className={classNames(styles.menuItem, {
                    [styles.selectedItem]: ele.id === selectedChat.id,
                  })}
                  onClick={() => {
                    fetchHistory(ele.id);
                    setSelectedChat(ele);
                  }}
                >
                  {ele.id === selectedChat.id && (
                    <span className={styles.dot}></span>
                  )}
                  <span className={styles.menuItemTitle}>
                    {ele.id === selectedChat.id && editMode ? (
                      <input
                        type="text"
                        value={`${newTitle ?? ele.title}`}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className={styles.input}
                        autoFocus
                      />
                    ) : (
                      ele.title
                    )}
                  </span>
                  {ele.id === selectedChat.id &&
                    (editMode ? (
                      <>
                        <CheckOutlined onClick={changeTitle} />
                        <CloseOutlined onClick={() => setEditMode(false)} />
                      </>
                    ) : (
                      <>
                        <EditOutlined onClick={() => setEditMode(true)} />
                        <Popconfirm
                          title="Delete the chat"
                          description="Are you sure you want delete this chat?"
                          onConfirm={() => deleteChat(ele.id)}
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contentArea}>{renderChats(chatDetails)}</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.input}
              placeholder="Send a message"
              disabled={selectedChat.id === "-1"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  postQuery(chatDetails.id, query);
                }
              }}
            />
            <Button
              shape="circle"
              disabled={selectedChat.id === "-1"}
              icon={<ArrowRightOutlined style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#5f5adb" }}
              onClick={() => postQuery(chatDetails.id, query)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
