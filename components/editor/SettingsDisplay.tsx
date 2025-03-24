import { SettingsDisplayProps } from "@/utils/componentTypes";

const SettingsDisplay = ({ settingsPage }: SettingsDisplayProps) => {
  return (
    <div className="w-full flex justify-center h-full items-center">
      {settingsPage.selectedSettingItem}
    </div>
  );
};

export default SettingsDisplay;
