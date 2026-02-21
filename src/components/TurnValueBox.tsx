type Props = {
  turnValue: number;
  tempValue: number;
  tempFlash: boolean;
};

export default function TurnValueBox({ turnValue, tempValue, tempFlash }: Props) {
    return (
        <div className="turnBox">
            <div className="turnValue">{turnValue}</div>
            {/** フラッシュ状態に応じてクラスを付与 */}
            <div className={`tempValue ${tempFlash ? "flash" : ""}`}>仮： {tempValue}</div>
        </div>
    );
}