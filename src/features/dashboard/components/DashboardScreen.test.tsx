import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardScreen } from "@/features/dashboard/components/DashboardScreen";

describe("DashboardScreen", () => {
  it('出撃ボタンをクリックすると、onNavigateが "battle" 引数で呼ばれること', () => {
    // vi.fn() を使って、呼び出し回数や引数を記録できる「モック（ダミー）関数」を作成します
    const mockOnNavigate = vi.fn();

    // コンポーネントを仮想ブラウザ環境（jsdom）にレンダリングします
    render(<DashboardScreen onNavigate={mockOnNavigate} />);

    // 画面の中から「Execute()」というテキストを持つ要素を探します
    const executeButton = screen.getByText("Execute()");

    // ユーザーがボタンをクリックする動作をシミュレートします
    fireEvent.click(executeButton);

    // mockOnNavigate関数が「1回だけ」呼ばれたことを検証
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);

    // mockOnNavigate関数が「'battle'」という引数とともに呼ばれたことを検証
    expect(mockOnNavigate).toHaveBeenCalledWith("battle");
  });

  it("未実装の機能がDisabled状態として表示されていること", () => {
    render(<DashboardScreen onNavigate={vi.fn()} />);

    // 「ScriptEditor()」などの未実装ボタンが存在するか確認
    expect(screen.getByText("ScriptEditor()")).toBeDefined();
    expect(screen.getByText("Documentation()")).toBeDefined();
    expect(screen.getByText("Settings()")).toBeDefined();
  });
});
