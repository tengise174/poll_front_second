"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Modal,
  Skeleton,
  Radio,
  Input,
  Button,
  QRCode,
  Layout,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Meta from "antd/es/card/Meta";
import { deletePollById, getAllPollBasic, getPollById } from "@/api/action";
import CustomButton from "@/components/CustomButton";
import PollCard from "@/components/PollCard";
import { useAlert } from "@/context/AlertProvider";
import { Content, Header } from "antd/es/layout/layout";
import Link from "next/link";
import { CopyOutlined } from "@ant-design/icons";

const MyPollsPage = () => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>(null);
  const [reqUrl, setReqUrl] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any>(null);
  const [currentId, setCurrentId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleCopyUrl = (reqUrl: string) => {
    navigator.clipboard
      .writeText(reqUrl)
      .then(() => {
        showAlert("Copied URL to clipboard", "success", "", true);
      })
      .catch(() => {
        showAlert("Failed to copy URL", "warning", "", true);
      });
  };

  const {
    data: fetchedData,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mypolls"],
    queryFn: () => getAllPollBasic(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: currentPollData,
    isFetching: isFetchingCurrentPoll,
    error: currentPollError,
    refetch: refetchCurrentPoll,
  } = useQuery({
    queryKey: ["mypoll", currentId],
    queryFn: () => getPollById(currentId),
    enabled: !!currentId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePollById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mypolls"] });
      showAlert("Амжилттай устгалаа", "success", "", true);
    },
    onError: (error: any) => {
      showAlert("Алдаа гарлаа", "error", "", true);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
      setFilteredData(fetchedData);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (currentPollData) {
      setCurrentPoll(currentPollData);
    }
  }, [currentPollData]);

  useEffect(() => {
    if (!data) return;

    let filtered = [...data];

    if (filterStatus !== "all" && filterStatus !== "recentlyCreated") {
      filtered = filtered.filter((poll: any) => {
        const currentDate = new Date();
        const isEnded =
          (poll.endDate && new Date(poll.endDate) < currentDate) ||
          (poll.pollsterNumber != null &&
            (poll.submittedUserNumber ?? 0) >= poll.pollsterNumber) ||
          ((poll.pollstersLength ?? 0) > 0 &&
            (poll.submittedUserNumber ?? 0) >= (poll.pollstersLength ?? 0));

        if (filterStatus === "created") {
          return !poll.published;
        } else if (filterStatus === "published") {
          return poll.published && !isEnded;
        } else if (filterStatus === "ended") {
          return isEnded;
        }
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((poll: any) =>
        poll.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus === "recentlyCreated") {
      filtered = filtered.sort((a: any, b: any) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }

    setFilteredData(filtered);
  }, [filterStatus, searchTerm, data]);

  if (isFetching) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div>Алдаа гарлаа</div>;
  }

  return (
    <Layout>
      <Header className="!bg-white shadow-md border-l border-0.5 border-[#D9D9D9]">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
          <Radio.Group
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            buttonStyle="solid"
            className="!flex !flex-row !gap-2"
          >
            <Radio.Button className="!rounded" value="all">
              Бүгд
            </Radio.Button>
            <Radio.Button className="!rounded" value="created">
              Үүссэн
            </Radio.Button>
            <Radio.Button className="!rounded" value="published">
              Нийтлэгдсэн
            </Radio.Button>
            <Radio.Button className="!rounded" value="ended">
              Дууссан
            </Radio.Button>
            <Radio.Button className="!rounded" value="recentlyCreated">
              Сүүлд үүссэн
            </Radio.Button>
          </Radio.Group>

          <Input.Search
            placeholder="Асуулгын гарчиг"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
      </Header>
      <Content className="overflow-y-auto">  
        <div className="p-4">
          {!filteredData?.length ? (
            <div>Танд үүсгэсэн асуулга байхгүй байна</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-4 mt-5 justify-center">
              {filteredData.map((item: any, index: number) => (
                <PollCard
                  {...item}
                  cardType="POLL"
                  setReqUrl={setReqUrl}
                  setCurrentId={setCurrentId}
                  setIsModalOpen={setIsModalOpen}
                  onDelete={handleDelete}
                  key={index}
                />
              ))}
            </div>
          )}
          <div className="w-full flex my-4 justify-end">
            <CustomButton
              title="Дахин оролдох"
              onClick={() => window.location.reload()}
              className="bg-clicked text-white hover:bg-main-purple hover:cursor-pointer px-4 !text-xs rounded-2xl"
            />
          </div>
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            title="Асуулга"
            width={500}
          >
            <div>
              <Card>
                <div>
                  <Meta
                    title={currentPoll?.title}
                    description={currentPoll?.greetingMessage}
                  />
                  <div className="text-xs flex flex-col gap-4 mt-4">
                    <div>
                      <p>QR Code</p>
                      <QRCode value={reqUrl || "-"} />
                    </div>
                    <div>
                      <p>Оролцох URL</p>
                      <div className="flex flex-row gap-2 items-center">
                        <Link href={reqUrl}>{reqUrl}</Link>
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyUrl(reqUrl)}
                          style={{ marginTop: "10px" }}
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default MyPollsPage;
