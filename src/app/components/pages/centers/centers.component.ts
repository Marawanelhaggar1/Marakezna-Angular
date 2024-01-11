import { Component } from '@angular/core';
import { Centers } from 'src/app/core/models/centers';
import { CentersService } from 'src/app/core/services/centers.service';

@Component({
    selector: 'app-centers',
    templateUrl: './centers.component.html',
    styleUrls: ['./centers.component.scss'],
})
export class CentersComponent {
    lang?: string;
    centers?: Centers[];
    constructor(private _centersServices: CentersService) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getCenters();
    }

    getCenters() {
        return this._centersServices.get().subscribe((centers) => {
            this.centers = centers.data;
        });
    }
}
