# code-card

## ライブデモ / Live Demo

Live Demo: [https://code-card-lg9s.vercel.app/](https://code-card-lg9s.vercel.app/)

## デモ映像 / Demo Movies

2026-03-03: タイトル画面とメインメニュー画面を実装。タイトル名を"def virus_defender(): # Coding Card Game"に決定。主人公をvirus_defender()関数に見立て、この関数内に関数のメタファーであるカードたちが入る、というコンセプト。バトル画面でHPバーを実装。

https://github.com/user-attachments/assets/4cf90b07-e368-4921-bef5-7f86edc1d206

<details>
  <summary>過去のデモ動画を見る（ここをクリック）</summary>

2026-02-27: Framer Motionを適応したUIへの変更結果。カードコンポーネント実装、Pythonコード実行、敵の挙動反映を実装。カードをドラッグすると、パネルでPythonコードが1行ずつハイライトされ、それに対応して敵のHPが減少する「ステップ実行」の様子。

https://github.com/user-attachments/assets/928cb9a4-d42a-49d8-ae1b-5de108eaa8d4

2026-02-22: カードコンポーネントが未実装のひな形。Framer Motionを使っていない状態。Pythonコードの実行が実装されている。

https://github.com/user-attachments/assets/d563a36e-0478-4aea-b632-902792bebbd7

</details>

---

## 概要 / Overview

本プロジェクトは、プログラミングの処理の流れを  
**カード操作** と **数値の変化** として可視化し、  
未学習者でも直感的に理解できるようにすることを目的とした学習支援アプリです。

This project is a learning support application that visualizes program execution
through **card-based interactions** and **dynamic value changes**,
allowing beginners to intuitively understand how code works.

---

## コンセプト / Concept

コードを読むだけでは把握しづらい  
「処理がどの順番で実行され、値がどのように変化するか」を、  
ゲーム的な体験として表現することを目指しています。
カードをプレイすると、内部のPythonコードが1行ずつステップ実行され、
ハイライトに合わせてゲーム内のステータス（HPやログ）が連動して変化します。

Instead of reading static code, this application provides a game-like experience
to help users understand **execution order** and **state changes** step by step.
When a card is played, the underlying Python code is executed line by line with highlights,
syncing the game's state (e.g., HP, logs) with the code logic.

---

## 使用技術 / Technologies

本プロジェクトでは、学習目的と保守性を両立させるため、以下の技術を選定・導入しています。

- **TypeScript / React / Vite**: 型安全で高速なモダンフロントエンド開発環境。
- **Zustand**: 軽量なグローバル状態管理。複雑化しやすいゲーム状態を一元管理し、コンポーネント間の過度なPropsリレーを防ぎ、ロジックとUIをクリーンに分離するために導入。
- **Framer Motion**: 流麗なカードアニメーションとドラッグ＆ドロップなどのUIインタラクションを簡単に実装するために使用。
- **Vitest / React Testing Library**: ロジックの単体テストやUIコンポーネントの結合テストを記述し、リファクタリング時のデグレ（機能破壊）を防ぐために導入。
- **Docker**: ローカル開発環境をコンテナ化し、開発者間の環境差異を排除するため。

---

## 主な特徴 / Features

- **関数のカード化 (Code-to-Card Abstraction)**: Pythonの実行単位（関数）をゲーム上の「カード」としてパッケージ化。引数や戻り値といった抽象的な概念を、カードの性能や効果として直感的に捉えることができます。
- **ステップ実行とハイライト**: カードを使用するとコードが1行ずつ実行され、処理の流れを視覚的に追うことができます。
- **状態変化の可視化**: 代入・演算・関数の戻り値などの基本構文が、そのままゲームのダメージや回復として画面に反映されます。
- **直感的なUI**: ドラッグ＆ドロップによるカード操作など、コードに不慣れでも遊びながら学べる設計です。

- **Code-to-Card Abstraction**: Encapsulating Python functions into playable cards. It makes abstract concepts like arguments and return values intuitive by representing them as card attributes.
- **Step-by-Step Execution**: Executing code line by line with visual highlights.
- **Visual State Changes**: Basic syntax like assignment, arithmetic, and return values are directly reflected as game actions (e.g., dealing damage).
- **Intuitive UI**: Drag-and-drop card interactions make learning to code feel like playing a game.

---

## アーキテクチャと品質保証 / Architecture & QA

本プロジェクトは、機能追加や仕様変更に強いスケーラブルな設計を目指しています。

- **機能駆動アーキテクチャ (Feature-Driven Architecture)**: 
  単なる「UI」や「Logic」といった技術ベースの分割ではなく、`battle` や `dashboard` といった機能単位でディレクトリを分割・カプセル化し、保守性を高めています。
- **状態と副作用の分離**:
  Zustandを用いた Store（状態管理）と、Engine（タイマーやAIなどの副作用管理）を明確に分けることで、UIコンポーネントをピュアに保っています。
- **3層の自動テスト**:
  - **Unit Test**: `utils` などの純粋関数のロジックを担保。
  - **Custom Hook Test**: UIに依存しない形での複雑な状態遷移（ターン制御やHP計算など）の結合テスト。
  - **UI Integration Test**: ユーザーの実際の操作（クリックや描画）に基づいたコンポーネントのテスト。

---

## 今後の展望 / Future Roadmap

今後の改善・拡張プランとして、以下の導入を予定しています。

1. **CI（継続的インテグレーション）の構築**
   - GitHub Actions等を導入し、コードのPushやPull Request時に自動でLint（静的解析）とTest（Vitest）が実行されるパイプラインを構築します。これにより、バグの混入を未然に防ぎ、常にプロダクションレディな品質を維持する仕組みを作ります。

---

## 起動方法 / How to Run

### Dockerを使用する場合 (推奨)
```bash
docker compose up -d --build
```
起動後、http://localhost:5174 にアクセスしてください

### ローカルのNode環境を使用する場合
```bash
npm install
npm run dev
```

---

## 制作背景・目的 / Motivation

- プログラミング初学者がつまずきやすい
- 「コードの実行イメージを頭の中で想像する」という工程を、
- アプリ側で肩代わりできないかと考え、本プロジェクトを制作しました。

- This project aims to reduce the cognitive load for beginners by externalizing
- the mental process of imagining code execution into a visual and interactive form.

---

## 利用について / Usage Notice

- 本リポジトリは 就職活動用ポートフォリオ として公開しています。
- コード・画像・アイデアの 無断転載、再配布、商用利用を禁止 します。

- This repository is published as a portfolio for job hunting purposes.
- Unauthorized copying, redistribution, or commercial use of the code,
- assets, or ideas is strictly prohibited.

---

## 開発記録 / Developer Notes

設計の変遷や意思決定のプロセスについては、以下のログを参照してください。

- [Decision Log](docs/decision-log.md)
