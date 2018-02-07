export interface Tick {
  id_tick: number;
  book: string;
  last: number;
  volume: number;
  ask: number;
  bid: number;
  vwap: number;
  tick_date: string;
  status: number;
}
