"use client";
import { PollCardType } from "@/utils/componentTypes";
import { Card, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import { BarChartOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

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
}: PollCardType) => {
  const router = useRouter();

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
