"use client";
import { ChartType } from "./types";

interface ChartSelectorProps {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}

const ChartSelector = ({ chartType, onChange }: ChartSelectorProps) => {
  return (
    <div className="mb-4">
      <label className="mr-2 text-gray-600">График төрөл:</label>
      <select
        value={chartType}
        onChange={(e) => onChange(e.target.value as ChartType)}
        className="p-2 border rounded"
      >
        <option value="pie">Дугуй диаграм</option>
        <option value="bar">Баганан диаграм</option>
        <option value="line">Шугаман диаграм</option>
      </select>
    </div>
  );
};

export default ChartSelector;
