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
  testfunc(){
    return this.http.get('https://api.api-ninjas.com/v1/geocode', {
      params: {
        q: 'San Francisco, CA'
      },
      headers: {
        'X-Api-Key': 'IvvFGqggAA7BZGdYlRqV4w==Dw28nRX7z6HI85e1'
      }
    });
  }

  private getLatLongByPlaces(addresses: string[]) {
    return this.http.post('https://api.api-ninjas.com/v1/geocode', addresses, {
      headers: {
        'X-Api-Key': 'IvvFGqggAA7BZGdYlRqV4w==Dw28nRX7z6HI85e1',
        'Content-Type': 'application/json',
      },
    }).pipe(
      map((results: any) => {
        const locations: any[] = [];
        const uniqueLocations = new Set();
  
        // Loop over each result and extract the unique locations
        results.forEach((result:any) => {
          const key = `${result.latitude},${result.longitude}`;
          if (!uniqueLocations.has(key)) {
            uniqueLocations.add(key);
            locations.push({
              name: result.name,
              lat: result.latitude,
              long: result.longitude
            });
          }
        });
  
        return locations;
      })
    );
  }

  getAllOffersWithLatLong(id:string): Observable<Offer[]> {
    const offerList = this.getAllOffers(id);
    const citiesList = this.getCities();
    
    return combineLatest([offerList, citiesList]).pipe(
      map(([offers, cities]) => {
        // Get a list of unique place names from the offer list
        let newOffers:any=offers
        const places = Array.from(new Set(newOffers.map((offer:any) => offer.location)));
  
        // Map place names to English names using the cities list
        const englishPlaces = places.map(place => {
          const city = cities.find(city => city.hebrewName === place);
          return city ? city.englishName : place;
        });
  
        // Get the latitude and longitude for each place using the getLatLongByPlaces function
        return this.getLatLongByPlaces(englishPlaces).pipe(
          map(locations => {
            // Combine the latitude and longitude data with the offer data
            let newOffers:any=offers
            return newOffers.map((offer:any) => {
              const place = cities.find(city => city.hebrewName === offer.location);
              const englishPlace = place ? place.englishName : offer.location;
              const location = locations.find(location => location.name === englishPlace);
              return {
                ...offer,
                lat: location ? location.lat : null,
                long: location ? location.long : null
              };
            });
          })
        );
      }),
      switchMap(offersWithLatLong => offersWithLatLong),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }
  
  
  // getAllOffersWithLatLong() {
  //   return forkJoin([
  //     this.getAllOffers('12'),
  //     this.getCities()
  //   ]).pipe(
  //     map(([offers, cities]) => {
  //       const citiesMap = new Map<string, City>();
  //       cities.forEach(city => citiesMap.set(city.hebrewName, city));
  //       const offersWithLatLong = offers.map((offer: any) => {
  //         const city = citiesMap.get(offer.location);
  //         if (city) {
  //           return {
  //             id: offer.id,
  //             time_start: new Date(offer.time_start),
  //             time_finish: new Date(offer.time_finish),
  //             location: offer.location,
  //             payment: offer.payment,
  //             lat: city.lat,
  //             long: city.long
  //           }
  //         }
  //       }).filter((offer) => !!offer);
  //       return offersWithLatLong;
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching data:', error);
  //       return of([]);
  //     })
  //   );
  // }

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
    return this.http.post('http://localhost:5000/user/add_rating', { data });
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