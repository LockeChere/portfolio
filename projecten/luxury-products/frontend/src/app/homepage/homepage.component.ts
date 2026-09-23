import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, TranslateModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

}
