import { useState } from "react";
import { BootScreen } from "@/features/boot/components/BootScreen";
import { DashboardScreen } from "@/features/dashboard/components/DashboardScreen";
import { BattleScreen } from "@/features/battle/components/BattleScreen";

export type ScreenType = "boot" | "dashboard" | "battle";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("boot");

  return (
    <div className="appRoot">
      {/* 1. タイトル画面 */}
      {currentScreen === "boot" && (
        <BootScreen onComplete={() => setCurrentScreen("dashboard")} />
      )}

      {/* 2. メインメニュー画面 */}
      {currentScreen === "dashboard" && (
        <DashboardScreen onNavigate={(screen) => setCurrentScreen(screen)} />
      )}

      {/* 3. バトル画面 */}
      {currentScreen === "battle" && (
        <BattleScreen onAbort={() => setCurrentScreen("dashboard")} />
      )}
    </div>
  );
}
