"use client";
import { PollCardType } from "@/utils/componentTypes";
import { Button, Card, Popover, Tooltip } from "antd";
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
  owner,
  greetingMessage,
  startDate,
  endDate,
  poster,
  setIsModalOpen,
  setCurrentId,
  onDelete,
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
      actions={[
        <Tooltip title="Өөрчлөх">
          <EditOutlined
            key="edit"
            onClick={() => router.push(`/editor/${id}`)}
          />
        </Tooltip>,
        <Tooltip title="Хариу харах">
          <BarChartOutlined
            key="stat"
            onClick={() => router.push(`/stat/${id}`)}
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
      ]}
    >
      <div
        onClick={() => (setCurrentId(id), setIsModalOpen(true))}
        className="hover:cursor-pointer hover:underline"
      >
        <Meta title={title} description={greetingMessage} />
      </div>
    </Card>
  );
};

export default PollCard;
