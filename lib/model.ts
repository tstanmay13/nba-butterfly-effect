export type TeamId = string;
export type AssetKind =
  | 'player'
  | 'rights'
  | 'obligation'
  | 'pick'
  | 'swap'
  | 'cash'
  | 'consideration';
export interface Team {
  id: TeamId;
  name: string;
  city: string;
  short: string;
  color: string;
  aliases?: { from: string; to: string; name: string }[];
}
export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  type: 'primary' | 'reporting';
  reviewed: string;
}
export interface ProtectionStage {
  year: number;
  protectedRanges: [number, number][];
  fallback?: string;
}
export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  detail?: string;
  origin?: TeamId | null;
  year?: number;
  round?: 1 | 2;
  number?: number;
  conditions?: string;
  protection?: ProtectionStage[];
  sources?: string[];
  candidates?: TeamId[];
}
export interface Movement {
  asset: string;
  from: TeamId;
  to: TeamId;
  form?: 'rights' | 'player' | 'player-rights';
  note?: string;
}
export interface Conversion {
  from: string;
  to: string;
  team: TeamId;
  kind: 'conveyance' | 'selection' | 'signing' | 'extinguished';
}
export interface Resolution {
  asset: string;
  status: 'exercised' | 'not-exercised' | 'extinguished' | 'deferred';
  detail: string;
}
export interface Transaction {
  id: string;
  date: string;
  order: number;
  kind: 'trade' | 'draft' | 'swap' | 'resolution';
  title: string;
  shortTitle: string;
  text: string;
  teams: TeamId[];
  moves: Movement[];
  conversions: Conversion[];
  resolutions: Resolution[];
  sources: string[];
  notes: string[];
  verified: 'verified';
  reviewed: string;
}
export interface Story {
  searchText?: string;
  id: string;
  title: string;
  headline: string;
  subtitle: string;
  category: 'Dallas' | 'Classic' | 'Modern';
  year: number;
  endYear: number;
  focus: TeamId;
  color: string;
  image?: string;
  imageAlt?: string;
  transactions: string[];
  root: string;
  cutoff: string;
  coverage: string;
  takeaway: string;
}
export interface Archive {
  schemaVersion: 1;
  reviewed: string;
  teams: Record<string, Team>;
  assets: Record<string, Asset>;
  sources: Record<string, Source>;
  transactions: Transaction[];
  stories: Story[];
}
export interface StoryData {
  schemaVersion: 1;
  story: Story;
  teams: Record<string, Team>;
  assets: Record<string, Asset>;
  sources: Record<string, Source>;
  transactions: Transaction[];
}
export interface ViewState {
  story: string;
  at: string;
  step: string;
  node: string | null;
  team: string;
  mode: 'trade' | 'map';
}
