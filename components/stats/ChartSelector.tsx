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
        <option value="pie">Pie Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
      </select>
    </div>
  );
};

export default ChartSelector;