import { Parent } from './parent.model';
export interface Rate {
  date: Date;
  byWho: number;
  ratedId: number;
  sumRating: number;
  desc: string;
}
