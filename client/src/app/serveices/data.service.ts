import { User } from './../models/user.model';
import { Person } from './../models/person.model';
import { HttpClient , HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly BASE_URL = 'http://localhost:5000';
  private REST_API_ALL_PARENTS = '/user/all_parents';
  private REST_API_ALL_NANIS = '/user/all_nanis';
  private REST_API_ADD_RATING = '/user/add_rating';
  private REST_API_ADD_OFFER = '/user/add_offer';
  private REST_API_ALL_OFFERS = '/user/all_offers/';
  private REST_API_ALL_HISTORY = '/user/all_history/';

  constructor(private http: HttpClient) {}

  getCities(): Observable<string[]> {
    const url = 'https://data.gov.il/api/3/action/datastore_search';
    const resource_id = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba';
    const limit = 2000;
    const params = { resource_id, limit };

    return this.http.get<IsraelCities>(url, { params }).pipe(
      map((response) => {
        const records = response.result.records;
        const fieldName = response.result.fields[2].id;
        return records
          .sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
          .map((record) => record[fieldName]);
      }),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }

  getParens() {
    return this.http.get(this.BASE_URL + this.REST_API_ALL_PARENTS, {});
  }

  getNanis() {
    return this.  http.get(this.BASE_URL + this.REST_API_ALL_NANIS, {});
  }

  getAllOffers(id:string){
    const params = new HttpParams().set('id', id);
    return this.http.get(this.BASE_URL + this.REST_API_ALL_OFFERS, {params})
  }
  
  getAllHistory(id:string){
    const params = new HttpParams().set('id', id);
    return this.http.get(this.BASE_URL + this.REST_API_ALL_HISTORY, {params})
  }

  add_rating(ratingForm: RatingForm) {
    let data = {
      date: ratingForm.date,
      desc: ratingForm.description,
      by_who: ratingForm.byWho,
      rated_id: ratingForm.employerName,
      sum_rating: ratingForm.rating,
    };
    return this.http.post('http://localhost:5000/user/add_rating', { data })
  }

  addOffer(data:OfferForm){
    return this.http.post(this.BASE_URL + this.REST_API_ADD_OFFER,{data})
  }
}
interface RatingForm {
  date: Date;
  description: string;
  byWho: string;
  employerName: string;
  rating: number;
}
interface OfferForm {
  id: string;
  time_start: Date;
  time_finish: Date;
  location: string;
  payment: number;
}

interface IsraelCities {
  result: {
    fields: {
      id: string;
    }[];
    records: {
      [key: string]: any;
    }[];
  };
}
