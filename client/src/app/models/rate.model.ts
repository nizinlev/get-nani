import { Parent } from './parent.model';
export interface Rate {
  date: Date;
  byHow: number;
  ratedId: number;
  sumRating: number;
  desc: string;
}
