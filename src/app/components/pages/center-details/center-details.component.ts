import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Centers } from 'src/app/core/models/centers';
import { CentersService } from 'src/app/core/services/centers.service';

@Component({
    selector: 'app-center-details',
    templateUrl: './center-details.component.html',
    styleUrls: ['./center-details.component.scss'],
})
export class CenterDetailsComponent {
    lang?: string;
    center?: Centers;
    centerId!: number;
    sub?: any;

    constructor(
        private _ActivatedRoutes: ActivatedRoute,
        private _centerService: CentersService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.sub = this._ActivatedRoutes.params.subscribe((params) => {
            this.centerId = params['id'];
            this.getCenterById(this.centerId);
        });
    }

    getCenterById(id: number) {
        return this._centerService.getById(id).subscribe((data) => {
            this.center = data.data;
            console.log(this.center);
        });
    }
}
