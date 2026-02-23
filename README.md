# code-card

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

Instead of reading static code, this application provides a game-like experience
to help users understand **execution order** and **state changes** step by step.

---

## 使用技術 / Technologies

- TypeScript
- React
- Vite

---

## 主な特徴 / Features

- 処理をカード単位で実行し、状態変化を視覚的に表示
- 代入・条件分岐・return などの基本構文を段階的に体験可能
- UI操作中心で、コードに不慣れでも理解しやすい設計

- Execute logic step by step using card-based actions
- Visual representation of variable and state changes
- Beginner-friendly UI focused on interaction rather than syntax

---

## 起動方法 / How to Run

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

Decision Log: docs/decision-log.md
