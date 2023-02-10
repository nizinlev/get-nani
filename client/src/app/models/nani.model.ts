import { Rate } from "./rate.model";

export interface Nani {
  id: number;
  role: string;
  age: number;
  residence: string;
  experienceYears: number;
  about: string;
  rating: number;
  history: Array<Rate>
}
