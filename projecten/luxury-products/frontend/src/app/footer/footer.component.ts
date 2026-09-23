import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {SwitchLanguageComponent} from '../switch-language/switch-language.component';

@Component({
  selector: 'app-footer',
  imports: [
    TranslatePipe,
    SwitchLanguageComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

}
