"use client";

import { useState, useCallback } from "react";

// ── types ──────────────────────────────────────────────────────────────────────

interface PlayerState {
  name: string;
  vp: number;
  cp: number;
}

const MAX_TURN = 5;

const INITIAL_PLAYER: PlayerState = { name: "", vp: 0, cp: 0 };

// ── canvas share card (no html2canvas — uses standard Canvas 2D API) ───────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function generateMatchCard(
  p1: PlayerState,
  p2: PlayerState,
  turn: number
): Promise<{ blob: Blob; filename: string }> {
  const W = 1200, H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const p1Name = p1.name || "Player 1";
  const p2Name = p2.name || "Player 2";
  const winner = p1.vp > p2.vp ? p1Name : p2.vp > p1.vp ? p2Name : null;

  // Background
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, W, H);

  // Header bar
  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(0, 0, W, 110);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 38px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("WARHAMMER 40,000", 48, 72);
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "700 26px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`BATTLE ROUND  ${turn} / ${MAX_TURN}`, W - 48, 72);

  // Center divider
  ctx.strokeStyle = "#222222";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, 130);
  ctx.lineTo(W / 2, 630);
  ctx.stroke();

  // Player panels
  const drawPlayer = (cx: number, name: string, vp: number, cp: number) => {
    const label = name.length > 16 ? name.slice(0, 15) + "…" : name;
    ctx.fillStyle = "#888888";
    ctx.font = "700 26px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label.toUpperCase(), cx, 200);

    ctx.fillStyle = "#f43f5e";
    ctx.font = "900 180px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(vp), cx, 450);

    ctx.fillStyle = "#444444";
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText("VP", cx, 502);

    ctx.fillStyle = "#555555";
    ctx.font = "700 28px Arial, sans-serif";
    ctx.fillText(`CP  ${cp}`, cx, 558);
  };

  drawPlayer(W / 4, p1Name, p1.vp, p1.cp);
  drawPlayer((W * 3) / 4, p2Name, p2.vp, p2.cp);

  // VS label
  ctx.fillStyle = "#333333";
  ctx.font = "900 44px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VS", W / 2, 360);

  // Result badge
  const badgeLabel = winner ? `${winner}  WIN` : "DRAW";
  ctx.fillStyle = winner ? "#b91c1c" : "#374151";
  roundRect(ctx, W / 2 - 140, 382, 280, 58, 10);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 22px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(badgeLabel.toUpperCase(), W / 2, 421);

  // Footer
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.lineTo(W, 640);
  ctx.stroke();
  ctx.fillStyle = "#2a2a2a";
  ctx.font = "600 22px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("#ウォーハンマー40k  #Warhammer40K", 48, 685);
  ctx.textAlign = "right";
  ctx.fillText("k713shino.vercel.app", W - 48, 685);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject()), "image/png")
  );
  const safe = (s: string) => s.replace(/[^\w぀-鿿]/g, "_").slice(0, 20);
  return {
    blob,
    filename: `wh40k_${safe(p1.name || "P1")}_vs_${safe(p2.name || "P2")}_r${turn}.png`,
  };
}

// ── sub-components ─────────────────────────────────────────────────────────────

function CounterButton({
  label,
  onMinus,
  onPlus,
  value,
  minValue = 0,
  accent = false,
}: {
  label: string;
  onMinus: () => void;
  onPlus: () => void;
  value: number;
  minValue?: number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-[0.6rem] font-bold uppercase tracking-widest"
        style={{ color: "var(--fg-muted)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMinus}
          disabled={value <= minValue}
          className="counter-btn"
          aria-label={`${label} -1`}
        >
          −
        </button>
        <span
          className="w-14 text-center tabular-nums font-black"
          style={{
            fontSize: "2.4rem",
            lineHeight: 1,
            color: accent ? "var(--accent-primary)" : "var(--fg-body)",
          }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onPlus}
          className="counter-btn counter-btn--plus"
          aria-label={`${label} +1`}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

function PlayerPanel({
  player,
  onVpChange,
  onCpChange,
  onNameChange,
  flipped = false,
}: {
  player: PlayerState;
  onVpChange: (delta: number) => void;
  onCpChange: (delta: number) => void;
  onNameChange: (name: string) => void;
  flipped?: boolean;
}) {
  return (
    <div
      className="player-panel"
      style={{ transform: flipped ? "rotate(180deg)" : undefined }}
    >
      <input
        className="player-name-input"
        value={player.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Player name"
        maxLength={20}
      />
      <div className="flex justify-around gap-4 pt-2">
        <CounterButton
          label="VP"
          value={player.vp}
          onMinus={() => onVpChange(-1)}
          onPlus={() => onVpChange(1)}
          accent
        />
        <CounterButton
          label="CP"
          value={player.cp}
          onMinus={() => onCpChange(-1)}
          onPlus={() => onCpChange(1)}
        />
      </div>
    </div>
  );
}

function TurnBar({
  turn,
  onPrev,
  onNext,
  onReset,
  onShare,
  isSharing,
  showConfirm,
  onConfirmReset,
  onCancelReset,
}: {
  turn: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onShare: () => void;
  isSharing: boolean;
  showConfirm: boolean;
  onConfirmReset: () => void;
  onCancelReset: () => void;
}) {
  return (
    <div className="turn-bar">
      {showConfirm ? (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>
            リセットしますか？
          </span>
          <button type="button" onClick={onConfirmReset} className="confirm-btn confirm-btn--danger">
            はい
          </button>
          <button type="button" onClick={onCancelReset} className="confirm-btn">
            いいえ
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onPrev}
            disabled={turn <= 1}
            className="turn-nav-btn"
            aria-label="前のターン"
          >
            ◀
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.35em]" style={{ color: "var(--fg-muted)" }}>
              Battle Round
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {Array.from({ length: MAX_TURN }, (_, i) => (
                <div
                  key={i}
                  className="turn-pip"
                  data-active={i < turn ? "true" : "false"}
                />
              ))}
            </div>
            <span
              className="tabular-nums font-black mt-0.5"
              style={{ fontSize: "1.6rem", lineHeight: 1, color: "var(--accent-primary)" }}
            >
              {turn} / {MAX_TURN}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNext}
              disabled={turn >= MAX_TURN}
              className="turn-nav-btn turn-nav-btn--next"
              aria-label="次のターン"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={onShare}
              disabled={isSharing}
              className="share-btn"
              aria-label="画像として保存"
              title="スコアを画像で保存"
            >
              {isSharing ? "…" : "📷"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="reset-btn"
              aria-label="リセット"
            >
              ↺
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── main ───────────────────────────────────────────────────────────────────────

export default function MatchTrackerClient() {
  const [turn, setTurn] = useState(1);
  const [p1, setP1] = useState<PlayerState>({ ...INITIAL_PLAYER });
  const [p2, setP2] = useState<PlayerState>({ ...INITIAL_PLAYER });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareModal, setShareModal] = useState<{ url: string; filename: string } | null>(null);

  const updateP1 = useCallback(
    (field: keyof PlayerState, delta: number | string) => {
      setP1((prev) => ({
        ...prev,
        [field]:
          typeof delta === "string"
            ? delta
            : Math.max(0, (prev[field] as number) + delta),
      }));
    },
    []
  );

  const updateP2 = useCallback(
    (field: keyof PlayerState, delta: number | string) => {
      setP2((prev) => ({
        ...prev,
        [field]:
          typeof delta === "string"
            ? delta
            : Math.max(0, (prev[field] as number) + delta),
      }));
    },
    []
  );

  const handleReset = () => setShowConfirm(true);
  const handleConfirmReset = () => {
    setTurn(1);
    setP1({ ...INITIAL_PLAYER });
    setP2({ ...INITIAL_PLAYER });
    setShowConfirm(false);
  };

  const handleShare = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const { blob, filename } = await generateMatchCard(p1, p2, turn);
      const file = new File([blob], filename, { type: "image/png" });

      let canWebShare = false;
      try {
        canWebShare = !!navigator.share && navigator.canShare({ files: [file] });
      } catch { /* browser throws instead of returning false */ }

      if (canWebShare) {
        await navigator.share({ files: [file], title: "WH40K Battle Result" });
      } else {
        setShareModal({ url: URL.createObjectURL(blob), filename });
      }
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, p1, p2, turn]);

  const closeShareModal = useCallback(() => {
    setShareModal((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  return (
    <>
      <style>{`
        .player-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem 1rem;
          flex: 1;
        }
        .player-name-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid var(--surface-border);
          outline: none;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--fg-body);
          width: 100%;
          max-width: 200px;
          padding: 0.15rem 0.25rem 0.25rem;
          letter-spacing: 0.04em;
        }
        .player-name-input::placeholder {
          color: var(--fg-muted);
          font-weight: 500;
        }
        .counter-btn {
          width: 2.6rem;
          height: 2.6rem;
          border-radius: 50%;
          border: 1.5px solid var(--surface-border);
          background: transparent;
          color: var(--fg-body);
          font-size: 1.3rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s, color 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .counter-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .counter-btn:not(:disabled):active {
          background: var(--surface-border);
        }
        .counter-btn--plus:not(:disabled) {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #fff;
        }
        .counter-btn--plus:not(:disabled):active {
          opacity: 0.8;
        }
        .turn-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1.2rem;
          border-top: 1px solid var(--surface-border);
          border-bottom: 1px solid var(--surface-border);
          background: var(--surface-primary);
          min-height: 5rem;
        }
        .turn-nav-btn {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 0.5rem;
          border: 1.5px solid var(--surface-border);
          background: transparent;
          color: var(--fg-body);
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .turn-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .turn-nav-btn:not(:disabled):active { background: var(--surface-border); }
        .turn-nav-btn--next:not(:disabled) {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #fff;
        }
        .share-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid var(--surface-border);
          background: transparent;
          color: var(--fg-muted);
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.12s;
        }
        .share-btn:not(:disabled):active { background: var(--surface-border); }
        .share-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .reset-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid var(--surface-border);
          background: transparent;
          color: var(--fg-muted);
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .reset-btn:active { background: var(--surface-border); }
        .turn-pip {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--surface-border);
          transition: background 0.15s;
        }
        .turn-pip[data-active="true"] {
          background: var(--accent-primary);
        }
        .confirm-btn {
          padding: 0.3rem 0.8rem;
          border-radius: 0.5rem;
          border: 1.5px solid var(--surface-border);
          background: transparent;
          color: var(--fg-body);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }
        .confirm-btn--danger {
          background: #ef4444;
          border-color: #ef4444;
          color: #fff;
        }
        .vp-diff-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.1rem 0.5rem;
          border-radius: 9999px;
          background: var(--accent-primary);
          color: #fff;
          letter-spacing: 0.04em;
        }
        .share-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1.5rem;
        }
        .share-modal {
          background: var(--surface-primary);
          border-radius: 1rem;
          padding: 1.25rem;
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .share-modal img {
          width: 100%;
          border-radius: 0.5rem;
          display: block;
        }
        .share-modal-hint {
          text-align: center;
          font-size: 0.75rem;
          color: var(--fg-muted);
          margin: 0;
        }
        .share-modal-actions {
          display: flex;
          gap: 0.5rem;
        }
        .share-modal-download {
          flex: 1;
          padding: 0.55rem;
          border-radius: 0.5rem;
          background: var(--accent-primary);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
        }
        .share-modal-close {
          padding: 0.55rem 1rem;
          border-radius: 0.5rem;
          border: 1.5px solid var(--surface-border);
          background: transparent;
          color: var(--fg-body);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      {shareModal && (
        <div className="share-modal-overlay" onClick={closeShareModal}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <img src={shareModal.url} alt="Battle Result" />
            <p className="share-modal-hint">長押し（または右クリック）で画像を保存</p>
            <div className="share-modal-actions">
              <a
                className="share-modal-download"
                href={shareModal.url}
                download={shareModal.filename}
              >
                ダウンロード
              </a>
              <button type="button" className="share-modal-close" onClick={closeShareModal}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="tracker-root"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
          background: "var(--bg-body)",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <PlayerPanel
          player={p2}
          onVpChange={(d) => updateP2("vp", d)}
          onCpChange={(d) => updateP2("cp", d)}
          onNameChange={(n) => updateP2("name", n)}
          flipped
        />

        <TurnBar
          turn={turn}
          onPrev={() => setTurn((t) => Math.max(1, t - 1))}
          onNext={() => setTurn((t) => Math.min(MAX_TURN, t + 1))}
          onReset={handleReset}
          onShare={handleShare}
          isSharing={isSharing}
          showConfirm={showConfirm}
          onConfirmReset={handleConfirmReset}
          onCancelReset={() => setShowConfirm(false)}
        />

        <PlayerPanel
          player={p1}
          onVpChange={(d) => updateP1("vp", d)}
          onCpChange={(d) => updateP1("cp", d)}
          onNameChange={(n) => updateP1("name", n)}
        />
      </div>
    </>
  );
}
