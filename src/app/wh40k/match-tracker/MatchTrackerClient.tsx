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
  showConfirm,
  onConfirmReset,
  onCancelReset,
}: {
  turn: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
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
          <button onClick={onConfirmReset} className="confirm-btn confirm-btn--danger">
            はい
          </button>
          <button onClick={onCancelReset} className="confirm-btn">
            いいえ
          </button>
        </div>
      ) : (
        <>
          <button
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
              onClick={onNext}
              disabled={turn >= MAX_TURN}
              className="turn-nav-btn turn-nav-btn--next"
              aria-label="次のターン"
            >
              ▶
            </button>
            <button
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
      `}</style>

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
        {/* Player 2 – rotated 180° for face-to-face viewing */}
        <PlayerPanel
          player={p2}
          onVpChange={(d) => updateP2("vp", d)}
          onCpChange={(d) => updateP2("cp", d)}
          onNameChange={(n) => updateP2("name", n)}
          flipped
        />

        {/* Center: turn bar */}
        <TurnBar
          turn={turn}
          onPrev={() => setTurn((t) => Math.max(1, t - 1))}
          onNext={() => setTurn((t) => Math.min(MAX_TURN, t + 1))}
          onReset={handleReset}
          showConfirm={showConfirm}
          onConfirmReset={handleConfirmReset}
          onCancelReset={() => setShowConfirm(false)}
        />

        {/* Player 1 */}
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
