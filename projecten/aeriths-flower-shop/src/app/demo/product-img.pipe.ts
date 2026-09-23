import { Pipe, PipeTransform } from '@angular/core';

/** Zet een imgUrl uit de data om naar een bruikbaar pad (lokale asset of volledige URL). */
@Pipe({ name: 'productImg', standalone: true })
export class ProductImgPipe implements PipeTransform {
  transform(imgUrl?: string | null): string {
    if (!imgUrl) return 'assets/img/logo.png';
    if (/^(https?:|data:)/.test(imgUrl)) return imgUrl;
    return 'assets/img/products/' + imgUrl.replace('img/', '');
  }
}
