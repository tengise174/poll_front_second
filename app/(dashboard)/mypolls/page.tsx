"use client";
import {
  deletePollById,
  getAllPoll,
  getAllPollBasic,
  getPollById,
} from "@/api/action";
import CustomButton from "@/components/CustomButton";
import PollCard from "@/components/PollCard";
import { useAlert } from "@/context/AlertProvider";
import { PollCardType } from "@/utils/componentTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Modal, Skeleton } from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";

const MyPollsPage = () => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>(null);
  const [currentId, setCurrentId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<any>(null);

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
    }
  }, [fetchedData]);

  useEffect(() => {
    if (currentPollData) {
      setCurrentPoll(currentPollData);
    }
  }, [currentPollData]);

  console.log(data);

  if (isFetching) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    showAlert("Алдаа гарлаа", "error", "", true);
    return (
      <div>
        <Button
          type="primary"
          title="Дахин оролдох"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      {!data?.length ? (
        <div>Танд үүсгэсэн асуулга байхгүй байна</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-4 mt-5 justify-center">
          {data.map((item: any, index: number) => (
            <PollCard
              {...item}
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
          <Card
            cover={
              <img
                alt="poster"
                src={
                  currentPoll?.poster ||
                  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                }
              />
            }
          >
            <div>
              <Meta
                title={currentPoll?.title}
                description={currentPoll?.greetingMessage}
              />
              <div className="text-xs my-4">
                <p>Эхлэх хугацаа : {currentPoll?.startDate || "Байхгүй"}</p>
                <p>Дуусах хугацаа : {currentPoll?.endDate || "Байхгүй"}</p>
                <p>Асуултын тоо: {currentPoll?.questions.length || "0"}</p>
                <p>Оролцогчийн тоо: {currentPoll?.pollsterNumber || "0"}</p>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default MyPollsPage;
