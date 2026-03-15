import { motion } from "framer-motion";

type Props = {
  onNavigate: (screen: "battle") => void; // 今後他画面が増えたら型を追加
};

export function DashboardScreen({ onNavigate }: Props) {
  return (
    <div className="dashboardScreen">
      <header className="dashboardHeader">
        <div className="headerTitle">/home/user/dashboard</div>
        <div className="headerStatus">
          STATUS: <span className="statusOk">ONLINE</span>
        </div>
      </header>

      <div className="dashboardMenu">
        {/* 出撃ボタン（実装済） */}
        <motion.button
          className="menuItem executeBtn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("battle")}
        >
          <div className="menuIcon">▶</div>
          <div className="menuText">
            <div className="menuTitle">Execute()</div>
            <div className="menuDesc">出撃 / ウイルススキャンを開始</div>
          </div>
        </motion.button>

        {/* 以下は未実装モジュールのプレースホルダー */}
        <motion.button
          className="menuItem disabled"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="menuIcon">⚙</div>
          <div className="menuText">
            <div className="menuTitle">ScriptEditor()</div>
            <div className="menuDesc">デッキ編成 (Not Implemented)</div>
          </div>
        </motion.button>

        <motion.button
          className="menuItem disabled"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="menuIcon">📄</div>
          <div className="menuText">
            <div className="menuTitle">Documentation()</div>
            <div className="menuDesc">カード図鑑 (Not Implemented)</div>
          </div>
        </motion.button>

        <motion.button
          className="menuItem disabled"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="menuIcon">🔧</div>
          <div className="menuText">
            <div className="menuTitle">Settings()</div>
            <div className="menuDesc">設定 (Not Implemented)</div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
