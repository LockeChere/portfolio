import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateProductService {
  private translations: any = {};

  constructor(private http: HttpClient) {}

  // Laad vertalingen voor de geselecteerde taal (bijvoorbeeld 'en' of 'nl')
  loadTranslations(language: string): Observable<any> {
    return this.http.get(`assets/i18n/${language}.json`).pipe(
      map((translations) => {
        this.translations = translations;
        console.log('Translations loaded:', this.translations);  // Debugging: Controleer of de vertalingen goed geladen zijn
        return translations;
      })
    );
  }

  // Vertaal productnaam
  translate(productId: string): string {
    // Verkrijg de vertaling voor het product ID uit de PRODUCTS-sectie van de JSON
    const translation = this.translations.PRODUCTS[productId];
    console.log(`Translating product ${productId}:`, translation);  // Debugging
  
    // Controleer of de vertaling aanwezig is en geef de vertaalde naam terug, anders geef een standaardtekst
    return translation ? translation.NAME : 'Name not available';
  }

  // Vertaal productbeschrijving
  translateDescription(productId: string): string {
  // Verkrijg de vertaling voor de beschrijving van het product
  const translation = this.translations.PRODUCTS[productId];
  console.log(`Translating description for product ${productId}:`, translation);  // Debugging

  // Controleer of de vertaling aanwezig is en geef de vertaalde beschrijving terug, anders geef een standaardtekst
  return translation ? translation.DESCRIPTION : 'Description not available';
}
}
