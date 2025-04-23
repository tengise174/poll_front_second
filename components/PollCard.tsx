"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Popover, Tag, Tooltip, Image } from "antd";
import {
  BarChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { PollCardType } from "@/utils/componentTypes";
import { CalendarOutlined } from "@ant-design/icons";

const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const PollCard = ({
  id,
  title,
  greetingMessage,
  poster,
  cardType,
  createdAt,
  answeredAt,
  setIsModalOpen,
  setCurrentId,
  onDelete,
  pushToId,
  setReqUrl,
  hasAnswers,
  published,
  endDate,
  pollsterNumber,
  submittedUserNumber,
  pollstersLength,
  questionLength,
}: PollCardType) => {
  const router = useRouter();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsPopoverVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsPopoverVisible(false);
  };

  const handleCardClick = () => {
    if (cardType === "POLL" && setCurrentId && setIsModalOpen) {
      setCurrentId(id);
      if (setReqUrl) {
        setReqUrl(`http://localhost:3000/test/${id}`);
      }
      setIsModalOpen(true);
    } else if (cardType === "ANSWER" && pushToId) {
      pushToId(id);
    }
  };

  const popoverContent = (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-end">
        <Button onClick={handleDeleteCancel}>Үгүй</Button>
        <Button type="primary" danger onClick={handleDeleteConfirm}>
          Тийм
        </Button>
      </div>
    </div>
  );

  const cardActions =
    cardType === "POLL"
      ? [
          <Tooltip title="Өөрчлөх">
            <EditOutlined
              key="edit"
              onClick={() => router.push(`/editor/${id}`)}
            />
          </Tooltip>,
          <Tooltip title="Хариу харах">
            <BarChartOutlined
              key="stat"
              onClick={() => router.push(`/stats/${id}`)}
            />
          </Tooltip>,
          <Popover
            content={popoverContent}
            title="Асуулгыг устгахдаа итгэлтэй байна уу?"
            trigger="click"
            open={isPopoverVisible}
            onOpenChange={(visible) => setIsPopoverVisible(visible)}
          >
            <Tooltip title="Устгах">
              <DeleteOutlined
                key="delete"
                onClick={() => setIsPopoverVisible(true)}
              />
            </Tooltip>
          </Popover>,
        ]
      : [];

  // Determine poll status for cardType === "POLL"
  const getPollStatus = () => {
    if (cardType !== "POLL") return null;

    if (!published) {
      return { label: "Үүссэн", color: "blue" };
    }

    const currentDate = new Date();
    const isEnded =
      (endDate && new Date(endDate) < currentDate) ||
      (pollsterNumber != null &&
        (submittedUserNumber ?? 0) >= pollsterNumber) ||
      ((pollstersLength ?? 0) > 0 &&
        (submittedUserNumber ?? 0) >= (pollstersLength ?? 0));

    if (isEnded) {
      return { label: "Дууссан", color: "red" };
    }

    return { label: "Нийтэлсэн", color: "green" };
  };

  const status = getPollStatus();

  return (
    <Card
      className="w-full h-full transition-transform duration-300 ease-in-out hover:scale-103 overflow-hidden"
      cover={
        <Image
          src={
            poster ||
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          }
          alt="poster"
          width={`${poster} ? 'auto' : 'full`}
          height={200}
        />
      }
      actions={cardActions}
    >
      <div
        onClick={handleCardClick}
        className="flex flex-col justify-between items-start gap-2 hover:cursor-pointer"
      >
        <div className="w-full flex flex-row justify-between items-start">
          <p
            className="font-semibold whitespace-normal overflow-wrap-break-word max-w-[60%] truncate"
            style={{ wordBreak: "break-word" }}
          >
            {title}
          </p>
          <div className="flex flex-row gap-1 text-xs">
            <CalendarOutlined />
            {cardType === "POLL" ? (
              <div>
                <Tag>
                {createdAt ? formatDate(createdAt) : "Unknown Date"}</Tag></div>
            ) : (
              <div>
                <Tag>
                  {answeredAt ? formatDate(answeredAt) : "Unknown Date"}
                </Tag>
              </div>
            )}
          </div>
        </div>
        <div>
          {cardType === "POLL" && status && (
            <div className=" flex flex-col gap-2">
              <Tag color={status.color}>{status.label}</Tag>
              <p className="text-xs text-[#555]">{questionLength} асуулттай</p>
            </div>
          )}
          {cardType === "ANSWER" && (
            <div>
              {hasAnswers ? (
                <Tag color="green">Хариулсан</Tag>
              ) : (
                <Tag color="red">Амжаагүй</Tag>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PollCard;
