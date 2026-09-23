import {Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService, TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-switch-language',
  imports: [TranslateModule],
  templateUrl: './switch-language.component.html',
  styleUrls: ['./switch-language.component.scss']
})
export class SwitchLanguageComponent {
  private translateService = inject(TranslateService)

  protected switchLanguage(selectedLanguage: string): void {
    this.translateService.use(selectedLanguage);
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }

}
