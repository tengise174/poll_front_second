"use client";

import ArrowDownIcon from "@/public/icons/arrow_down";
import SidebarBottomIcon from "@/public/icons/sidebar_bottom";
import { QuestionSquareEditorProps } from "@/utils/componentTypes";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Collapse, message } from "antd";
import React, { createContext, useContext, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import LayerIcon from "@/public/icons/layer";
import CustomButton from "../CustomButton";
// import { postSurveyMultipleQuestionsById } from "@/api/action";

interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
}

const DragIndexContext = createContext<DragIndexState>({
  active: -1,
  over: -1,
});

const QuestionSquareEditor = ({
  id,
  newQuestions,
  setNewQuestions,
  setChosenType,
  setCurrentPage,
  templateQuestions,
}: QuestionSquareEditorProps) => {
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);

    if (oldIndex !== newIndex) {
      setNewQuestions((prev) => {
        const updatedQuestions = arrayMove(prev, oldIndex, newIndex);

        return updatedQuestions.map((question, index) => ({
          ...question,
          order: index,
        }));
      });
    }
  };

  const dragActiveStyle = (dragState: DragIndexState, id: number) => {
    const { active, over } = dragState;
    let style: React.CSSProperties = {};
    if (active && active === id) {
      style = { backgroundColor: "gray", opacity: 0.5 };
    }
    return style;
  };

//   const handleSaveNewQuestions = async () => {
//     try {
//       setLoading(true);
//       await postSurveyMultipleQuestionsById({
//         id: id as string,
//         body: newQuestions,
//       });
//       message.success("Амжилттай");
//       setLoading(false);
//     } catch (e) {
//       setLoading(false);
//       console.log(e);
//     }
//   };

  const SortableItem = ({ question, index }: { question: any; index: any }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      isDragging,
      transition,
      transform,
    } = useSortable({
      id: index,
    });
    const dragState = useContext(DragIndexContext);

    const style: React.CSSProperties = {
      transition,

      transform: CSS.Translate.toString(transform),
      cursor: "move",
      ...dragActiveStyle(dragState, index),
      ...(isDragging
        ? { position: "relative", zIndex: 10, userSelect: "none" }
        : {}),
    };

    return (
      <div className="flex bg-[#FFFFFF] rounded-[10px] h-full max-h-[60px]">
        <div
          onClick={() => {
            setChosenType(question.questionType);
            setCurrentPage(index);
          }}
          className="bg-orange-500 text-white rounded-l-[10px] min-w-[33px] max-w-[33px] flex items-center justify-center min-h-full cursor-pointer"
        >
          {index + 1}
        </div>
        <p
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="text-[13px] text-[#757575] leading-[16px] font-medium mx-[10px] py-[6px] cursor-grab w-full"
        >
          {question.content}
        </p>
      </div>
    );
  };

  return (
    <div className="mt-5 px-5 overflow-y-auto pb-[60px]">
      {newQuestions[0].content !== "" && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <Collapse
            bordered={false}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <ArrowDownIcon
                style={{
                  transform: isActive ? "" : "rotate(270deg)",
                }}
              />
            )}
            className="bg-[#F5F5F5] rounded-[10px] mb-[14px]"
            items={[
              {
                key: "1",
                label: (
                  <div className="flex items-center gap-x-[10px] h-[22px]">
                    <SidebarBottomIcon />
                    <p className="text-[#1E1E1E] font-medium text-[13px] leading-[14px]">
                      Нэмэлт
                    </p>
                  </div>
                ),
                children: (
                  <SortableContext
                    items={newQuestions.map((_, index) => index.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-y-[10px]">
                      {newQuestions
                        .sort((a, b) => a.order - b.order)
                        .map((question, index) => (
                          <SortableItem
                            key={index}
                            index={index}
                            question={question}
                          />
                        ))}
                    </div>
                  </SortableContext>
                ),
              },
            ]}
          />
        </DndContext>
      )}
      <Collapse
        bordered={false}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <ArrowDownIcon
            style={{
              transform: isActive ? "" : "rotate(270deg)",
            }}
          />
        )}
        className="bg-[#F5F5F5] rounded-[10px]"
        items={[
          {
            key: "1",
            label: (
              <div className="flex items-center gap-x-[10px] h-[22px]">
                <LayerIcon />
                <p className="text-[#1E1E1E] font-medium text-[13px] leading-[14px]">
                  Үндсэн
                </p>
              </div>
            ),
            children: (
              <div className="flex flex-col gap-y-[10px]">
                {templateQuestions?.map((question, index) => (
                  <div
                    key={index}
                    className="flex bg-[#FFFFFF] rounded-[10px] h-full max-h-[60px]"
                  >
                    <div className="bg-orange-500 text-white rounded-l-[10px] min-w-[33px] max-w-[33px] flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="text-[13px] text-[#757575] leading-[16px] font-medium mx-[10px] py-[6px]">
                      {question?.content}
                    </p>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
      <CustomButton
        loading={loading}
        disabled={loading}
        titleClassname="text-[#FDFDFD] text-[14px] font-semibold "
        className="h-[42px] w-full bg-[#0056D2] cursor-pointer rounded-lg flex items-center justify-center mt-[10px]"
        // onClick={handleSaveNewQuestions}
        title="Хадгалах"
      />
    </div>
  );
};

export default QuestionSquareEditor;
