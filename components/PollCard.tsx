"use client";
import { PollCardType } from "@/utils/componentTypes";
import { Button, Card, Popover, Tag, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import {
  BarChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PollCard = ({
  id,
  title,
  greetingMessage,
  poster,
  cardType,
  setIsModalOpen,
  setCurrentId,
  onDelete,
  pushToId,
  hasAnswers,
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
      setIsModalOpen(true);
    } else if (cardType === "ANSWER" && pushToId) {
      console.log('aaa');
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

  return (
    <Card
      className="w-full h-full transition-transform duration-300 ease-in-out hover:scale-103 overflow-hidden"
      cover={
        <img
          alt="poster"
          src={
            poster ||
            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          }
        />
      }
      actions={cardActions}
    >
      <div
        onClick={handleCardClick}
        className="hover:cursor-pointer hover:underline"
      >
        <Meta title={title} description={greetingMessage} />
        {cardType === "ANSWER" && hasAnswers ? (
          <Tag>Хариулсан</Tag>
        ) : (
          <Tag>Амжаагүй</Tag>
        )}
      </div>
    </Card>
  );
};

export default PollCard;
