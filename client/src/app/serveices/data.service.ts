import { User } from './../models/user.model';
import { Person } from './../models/person.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getCities():Observable<string[]> {
    const url = 'https://data.gov.il/api/3/action/datastore_search';
    const resource_id = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba';
    const limit = 2000;
    const params = { resource_id, limit };

    return this.http.get<IsraelCities>(url, { params }).pipe(map((response) => {
        const records = response.result.records;
        const fieldName = response.result.fields[2].id;
        return records          
        .sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        .map(record => record[fieldName]);
      }),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }
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
