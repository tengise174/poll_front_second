import {
  employeeData,
  pollsterData,
} from "@/app/(dashboard)/editor/utils/content";
import { SettingsDisplayProps } from "@/utils/componentTypes";
import ManageEmpTable from "./ManageEmpTable";
import AddPollsterTable from "./AddPollsterTable";
import MakeTempCard from "./MakeTempCard";

const SettingsDisplay = ({
  settingsPage,
  setSettingsPage,
}: SettingsDisplayProps) => {
  console.log(settingsPage);

  return (
    <div className="w-full flex justify-center h-full items-center">
      {settingsPage.selectedSettingItem === "EMPLOYEE_MANAGE" && (
        <div className="w-full h-full">
          <ManageEmpTable dataSource={employeeData} />
        </div>
      )}
      {settingsPage.selectedSettingItem === "ACCESS_LEVEL" && (
        <div className="w-full h-full">
          <AddPollsterTable dataSource={pollsterData} />
        </div>
      )}
      {settingsPage.selectedSettingItem === "TEMPLATE" && (
        <MakeTempCard
          settingsPage={settingsPage}
          setSettingsPage={setSettingsPage}
        />
      )}
    </div>
  );
};

export default SettingsDisplay;
