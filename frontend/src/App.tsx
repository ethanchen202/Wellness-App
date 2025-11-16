import { useState } from "react";
import {
  Home as HomeIcon,
  BarChart2,
  Settings as SettingsIcon,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./components/Sidebar";

import Home from "./components/Home";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import NotificationStack from "./components/Notifications/NotificationStack";

function App() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", icon: HomeIcon },
    { name: "Analytics", icon: BarChart2 },
    { name: "Settings", icon: SettingsIcon },
  ];

  // Map index to component
  const contentComponents = [
    <Home key="home" />,
    <Analytics key="analytics" />,
    <Settings key="settings" />,
  ];

  return (
    <div className="flex w-full h-screen">
      <Sidebar
        items={sidebarItems}
        currentIdx={currentIdx}
        onChange={setCurrentIdx} // update selected item on click
      />
      <div className="flex w-full h-full bg-gray-400">
        {contentComponents[currentIdx]}
      </div>
      <NotificationStack />
    </div>
  );
}

export default App;
