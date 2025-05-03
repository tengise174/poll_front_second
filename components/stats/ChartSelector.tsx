"use client";
import { useTranslation } from "react-i18next";
import { ChartType } from "./types";

interface ChartSelectorProps {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}

const ChartSelector = ({ chartType, onChange }: ChartSelectorProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-4">
      <label className="mr-2 text-gray-600">{t("chart.chartType")}:</label>
      <select
        value={chartType}
        onChange={(e) => onChange(e.target.value as ChartType)}
        className="p-2 border rounded"
      >
        <option value="pie">{t("chart.pie")}</option>
        <option value="bar">{t("chart.bar")}</option>
        <option value="line">{t("chart.line")}</option>
        <option value="donut">{t("chart.donut")}</option>
        <option value="area">{t("chart.area")}</option>
      </select>
    </div>
  );
};

export default ChartSelector;
