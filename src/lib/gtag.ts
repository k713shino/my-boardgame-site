export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GtagEventParams = {
  [key: string]: string | number | boolean | undefined;
};

export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
};

export const event = (action: string, params: GtagEventParams = {}) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
};

// ── WH40K カスタムイベント ────────────────────────────────────────────────────

/** ロスターをローカル保存したとき */
export const trackRosterSave = (params: {
  faction: string;
  points: number;
  unit_count: number;
}) => event("roster_save", params);

/** ロスターをDB（公開）に保存したとき */
export const trackRosterCreate = (params: {
  faction: string;
  points: number;
  unit_count: number;
  is_public: boolean;
}) => event("roster_create", params);

/** 共有URLをコピーしたとき */
export const trackRosterShare = (params: {
  roster_id: string;
  faction: string;
}) => event("roster_share", params);

/** ユニットのデータシートを開いたとき */
export const trackDatasheetOpen = (params: {
  unit_slug: string;
  unit_name: string;
  faction: string;
}) => event("datasheet_open", params);

/** アーミービルダーで陣営を選択したとき */
export const trackArmySelect = (params: {
  faction: string;
}) => event("army_select", params);

/** デタッチメントを選択したとき */
export const trackDetachmentSelect = (params: {
  faction: string;
  detachment: string;
}) => event("detachment_select", params);

/** ポイント上限を変更したとき */
export const trackPointsChange = (params: {
  points_limit: number;
}) => event("points_change", params);
