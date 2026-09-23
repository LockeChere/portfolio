import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AerithsFlowerShopFormService {

  constructor() { }

  getCreditCardMoths(startMonth: number): Observable<number[]>{

    let data: number[] = [];

    //build array month
    //loop until 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);

  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    //build array year
    //loop until 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }


}
