import { filter } from 'rxjs/operators';
import { User } from './../models/user.model';
import { Person } from './../models/person.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, combineLatest, forkJoin, map, Observable, of, shareReplay, switchMap } from 'rxjs';

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

  getCities(): Observable<any[]> {
    const url = 'https://data.gov.il/api/3/action/datastore_search';
    const resource_id = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba';
    const limit = 2000;
    const params = { resource_id, limit };

    return this.http.get<IsraelCities>(url, { params }).pipe(
      map((response) => {
        const records = response.result.records;
        const fieldName = response.result.fields[2].id;
        const englishName = response.result.fields[3].id;
        return records
          .sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
          .map((record) => ({
            hebrewName: record[fieldName],
            englishName: record[englishName],
          }));
      }),
      shareReplay(),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }
  getLatLongByPlace(placeName:string){
    const KEY = '84d2945728b2449e8f10f2a08c9ed5d6'
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${placeName}&key=${KEY}&language=he&countrycode=il&limit=1`;
    return this.http.get(url,{})
  }

  getAllOffersWithLatLong(id:string): Observable<Offer[]> {
    const offerList = this.getAllOffers(id);
    const citiesList = this.getCities();
      
    return combineLatest([offerList, citiesList]).pipe(
      switchMap(([offers, cities]) => {
        // Get a list of unique place names from the offer list
        let newOffers:any=offers
        // filter only relevant offers
        newOffers=newOffers.filter((offer:any)=>new Date(offer.time_start)>new Date())
        const places: string[] = Array.from(new Set(newOffers.map((offer:any) => offer.location)));
  
        // get list of places with lat and long 
        let latLongs: { [key: string]: { lat: number, long: number } } = {};
        let requests = places.map((place:any) => this.getLatLongByPlace(place).toPromise());
        return forkJoin(requests).pipe(
          map((responses: any[]) => {
            responses.forEach((data: any, index: number) => {
              const geometry = data.results[0].geometry;
              latLongs[places[index]] = { lat: geometry.lat, long: geometry.lng };
            });
  
            return newOffers.map((offer:any)=>{
              return {
                ...offer,
                lat: latLongs[offer.location]? latLongs[offer.location].lat: null,
                long: latLongs[offer.location]? latLongs[offer.location].long: null,
              }
            });
          })
        )
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
    return this.http.get(this.BASE_URL + this.REST_API_ALL_NANIS, {});
  }

  getAllOffers(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.BASE_URL + this.REST_API_ALL_OFFERS, { params });
  }

  getAllHistory(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.BASE_URL + this.REST_API_ALL_HISTORY, { params });
  }

  add_rating(ratingForm: RatingForm) {
    let data = {
      date: ratingForm.date,
      desc: ratingForm.description,
      by_who: ratingForm.byWho,
      rated_id: ratingForm.employerName,
      sum_rating: ratingForm.rating,
    };
    return this.http.post('https://get-nani.herokuapp.com/user/add_rating', { data });
  }

  addOffer(data: OfferForm) {
    return this.http.post(this.BASE_URL + this.REST_API_ADD_OFFER, { data });
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
interface Offer {
  id: string;
  time_start: Date;
  time_finish: Date;
  location: string;
  payment: number;
  lat: number;
  long: number;
}

interface City {
  hebrewName: string;
  englishName: string;
}