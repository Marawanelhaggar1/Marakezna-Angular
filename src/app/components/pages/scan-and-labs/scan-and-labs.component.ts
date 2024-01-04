import { Component } from '@angular/core';
import {
    ActivatedRoute,
    NavigationStart,
    Params,
    Router,
} from '@angular/router';
import { Centers } from 'src/app/core/models/centers';
import { CentersService } from 'src/app/core/services/centers.service';

@Component({
    selector: 'app-scan-and-labs',
    templateUrl: './scan-and-labs.component.html',
    styleUrls: ['./scan-and-labs.component.scss'],
})
export class ScanAndLabsComponent {
    lang?: string;
    centers: Centers[] = [];
    center?: Centers;
    sub!: any;

    constructor(
        private _centerServices: CentersService,
        private _ActivatedRoute: ActivatedRoute,
        private _router: Router
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }

        this.sub = Object.assign({}, this._ActivatedRoute.snapshot.queryParams);

        // this.getCenters();
        if (this.sub.center) {
            this.getCenterById(this.sub.center);
        } else {
            this.getCenters();
        }

        this._router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                const currentParams = this._ActivatedRoute.snapshot.queryParams;

                this._ActivatedRoute.queryParams.subscribe(
                    (updatedParams: Params) => {
                        if (
                            !this.areParamsEqual(currentParams, updatedParams)
                        ) {
                            // URL parameters have changed, reload the window with the new parameters
                            const updatedUrl = this._router
                                .createUrlTree([], {
                                    queryParams: updatedParams,
                                    queryParamsHandling: 'merge',
                                })
                                .toString();
                            window.location.href = updatedUrl;
                        }
                    }
                );
            }
        });
    }

    areParamsEqual(params1: any, params2: any): boolean {
        // Compare the parameters to check if they are equal
        // Implement your own comparison logic here
        // For example, you can compare individual properties or stringify the objects and compare
        return JSON.stringify(params1) === JSON.stringify(params2);
    }

    getCenterById(id: number) {
        // this.centers = [];
        return this._centerServices.getById(id).subscribe((data) => {
            this.center = data.data;
            // this.centers.push(this.center);
        });
    }

    getLabs() {
        // this.centers = [];
        return this._centerServices.getLabs().subscribe((labs) => {
            this.centers = labs.data;
            console.log(this.centers);
        });
    }

    getLabsByArea(id: number) {
        // this.centers = [];
        return this._centerServices.getLabsByArea(id).subscribe((labs) => {
            this.centers = labs.data;
            console.log(this.center);
        });
    }

    getScans() {
        // this.centers = [];
        return this._centerServices.getScans().subscribe((scans) => {
            this.centers = scans.data;
            console.log(this.center);
        });
    }

    getScanByArea(id: number) {
        // this.centers = [];
        console.log(this.center);

        return this._centerServices.getScansByArea(id).subscribe((scans) => {
            this.centers = scans.data;
        });
    }

    getCenters() {
        if (this.sub.area && this.sub.category) {
            console.log('cat and area');
            if (this.sub.category == 'Scan' || this.sub.category == 'أشعة') {
                this.getScanByArea(this.sub.area);
            } else if (
                this.sub.category == 'Lab' ||
                this.sub.category == 'معمل'
            ) {
                this.getLabsByArea(this.sub.area);
            }
        } else if (this.sub.category) {
            console.log('cat ');

            if (this.sub.category == 'Scan' || this.sub.category == 'أشعة') {
                this.getScans();
            } else if (
                this.sub.category == 'Lab' ||
                this.sub.category == 'معمل'
            ) {
                this.getLabs();
            }
        } else if (this.sub.area) {
            console.log(' area');

            this._centerServices
                .getByArea(this.sub.area)
                .subscribe((data) => (this.centers = data.data));
        } else {
            console.log('all');

            this._centerServices.get().subscribe({
                next: (data) => {
                    this.centers = data.data;
                },
            });
        }
    }
}
