import { Rate } from "./rate.model";

export interface Parent {
  id: number;
  childName: string;
  childGender: string;
  childAge: number;
  residence: string;
  rating: number;
  history: Array<Rate>
}
