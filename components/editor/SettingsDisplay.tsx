import { employeeData } from "@/app/(dashboard)/editor/utils/content";
import AddPollsterTable from "./AddPollsterTable";
import { SettingsDisplayProps } from "@/utils/componentTypes";

const SettingsDisplay = ({
  settingsPage,
  setSettingsPage,
}: SettingsDisplayProps) => {
  return (
    <div className="w-full flex justify-center h-full items-center">
      {settingsPage.selectedSettingItem === "ACCESS_LEVEL" && (
        <div className="w-full h-full">
          <AddPollsterTable
            settingsPage={settingsPage}
            setSettingsPage={setSettingsPage}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsDisplay;
