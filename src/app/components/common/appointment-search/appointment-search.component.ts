import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Areas } from 'src/app/core/models/areas';
import { Centers } from 'src/app/core/models/centers';
import { Doctor } from 'src/app/core/models/doctor';
import { Specialization } from 'src/app/core/models/specialization';
import { SubAreaModel } from 'src/app/core/models/sub-area-model';
import { AreaService } from 'src/app/core/services/area.service';
import { CentersService } from 'src/app/core/services/centers.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { SpecializationService } from 'src/app/core/services/specialization.service';

@Component({
    selector: 'app-appointment-search',
    templateUrl: './appointment-search.component.html',
    styleUrls: ['./appointment-search.component.scss'],
})
export class AppointmentSearchComponent {
    form1 = true;
    form2 = false;
    searchForm!: FormGroup;
    scanForm!: FormGroup;
    lang?: string;
    specialty: Specialization[] = [];
    doctors: Doctor[] = [];
    doctor: string[] = [];
    categories: string[] = [];
    specialties?: string[] = [];
    areas: string[] = [];
    area: Areas[] = [];
    subAreas: string[] = [];
    subArea: SubAreaModel[] = [];
    subAreaId?: number;
    centers: string[] = [];
    center: Centers[] = [];
    docId?: number;
    CenterId?: number;
    specialtyId?: number;
    areaId?: number;

    constructor(
        private _formBuilder: FormBuilder,
        public router: Router,
        private _specializations: SpecializationService,
        private _doctorService: DoctorService,
        private _areaService: AreaService,
        private _centerService: CentersService
    ) {
        this.searchForm = _formBuilder.group({
            area: ['', [Validators.required]],
            subArea: ['', [Validators.required]],
            center: ['', [Validators.required]],
            specialty: ['', [Validators.required]],
            doctor: ['', [Validators.required]],
        });

        this.scanForm = _formBuilder.group({
            category: ['', [Validators.required]],
            area: ['', [Validators.required]],
            subArea: ['', [Validators.required]],
            center: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }

        if (this.lang == 'ltr') {
            this.categories = ['Scan', 'Lab'];
        } else {
            this.categories = ['أشعة', 'معمل'];
        }
        this.getSpecialties();
        this.getDoctor();
        this.getArea();
        this.getCenter();
        this.getSubArea();
    }

    getSpecialties() {
        return this._specializations.get().subscribe((special) => {
            this.specialty = special.data;
            for (const specialization of this.specialty) {
                this.specialties?.push(specialization.specialty);
            }
        });
    }

    getDoctor() {
        this.doctor = [];
        if (this.searchForm.value.center && this.searchForm.value.specialty) {
            let s: Specialization = this.specialty.find(
                (specialty) =>
                    specialty.specialty == this.searchForm.value.specialty
            )!;
            let c: Centers = this.center.find(
                (c) => c.name === this.searchForm.value.center
            )!;
            return this._doctorService
                .getByCenterAndSpecialty(c.id, s.id)
                .subscribe({
                    next: (data) => {
                        // console.log(data);
                        this.doctors = data.data;
                        for (const doc of this.doctors) {
                            this.doctor?.push(doc.name);
                        }
                        this.set();
                    },
                });
        } else if (this.searchForm.value.center) {
            let c: Centers = this.center.find(
                (c) => c.name === this.searchForm.value.center
            )!;

            // console.log(c.id);
            return this._doctorService.getByCenter(c.id).subscribe({
                next: (data) => {
                    // console.log(data);
                    this.doctors = data.data;
                    for (const doc of this.doctors) {
                        this.doctor?.push(doc.name);
                    }
                    this.set();
                },
            });
        } else if (this.searchForm.value.specialty) {
            let s: Specialization = this.specialty.find(
                (specialty) =>
                    specialty.specialty == this.searchForm.value.specialty
            )!;
            return this._doctorService.getBySpecialty(s.id).subscribe({
                next: (data) => {
                    // console.log(data);
                    this.doctors = data.data;
                    for (const doc of this.doctors) {
                        this.doctor?.push(doc.name);
                    }
                    this.set();
                },
            });
        } else {
            return this._doctorService.get().subscribe({
                next: (data) => {
                    // console.log(data);
                    this.doctors = data.data;
                    for (const doc of this.doctors) {
                        this.doctor?.push(doc.name);
                    }
                    // this.set();
                },
            });
        }
    }

    getArea() {
        return this._areaService.get().subscribe({
            next: (data) => {
                this.area = data.data;
                for (const area of this.area) {
                    this.areas.push(area.name);
                }
            },
        });
    }

    getSubArea() {
        return this._areaService.getSubArea().subscribe({
            next: (data) => {
                this.subArea = data.data;
                for (const area of this.subArea) {
                    this.subAreas.push(area.name);
                }
                // console.log(this.subAreas);
            },
        });
    }

    getAllLabsAndScans() {
        this.centers = [];
        if (this.scanForm.value.subArea) {
            let a: SubAreaModel = this.subArea.find(
                (a) => a.name === this.scanForm.value.subArea
            )!;
            console.log(a);

            return this._centerService.getBySubArea(a.id).subscribe({
                next: (data) => {
                    console.log(data);
                    this.center = data.data;
                    for (const cen of this.center) {
                        this.centers.push(cen.name);
                    }
                },
            });
        } else if (this.scanForm.value.area) {
            let a: Areas = this.area.find(
                (a) => a.name === this.scanForm.value.area
            )!;
            console.log(a);

            return this._centerService.getByArea(a.id).subscribe({
                next: (data) => {
                    console.log(data);
                    this.center = data.data;
                    for (const cen of this.center) {
                        this.centers.push(cen.name);
                    }
                },
            });
        } else {
            return this._centerService.getLabsAndScans().subscribe({
                next: (data) => {
                    this.center = data.data;
                    for (const cen of this.center) {
                        this.centers.push(cen.name);
                    }
                },
            });
        }
    }

    getCenter() {
        // console.log(this.searchForm.value);
        if (this.searchForm.value.area) {
            let a: Areas = this.area.find(
                (a) => a.name === this.searchForm.value.area
            )!;
            this.getSubAreaByArea(a.id);
        }
        this.centers = [];
        if (this.searchForm.value.subArea) {
            let a: SubAreaModel = this.subArea.find(
                (a) => a.name === this.searchForm.value.subArea
            )!;
            console.log(a);

            return this._centerService.getBySubArea(a.id).subscribe({
                next: (data) => {
                    console.log(data);
                    this.center = data.data;
                    for (const cen of this.center) {
                        this.centers.push(cen.name);
                    }
                },
            });
        } else if (this.searchForm.value.area) {
            let a: Areas = this.area.find(
                (a) => a.name === this.searchForm.value.area
            )!;
            console.log(a);

            return this._centerService.getByArea(a.id).subscribe({
                next: (data) => {
                    console.log(data);
                    this.center = data.data;
                    for (const cen of this.center) {
                        this.centers.push(cen.name);
                    }
                },
            });
        } else {
            return this._centerService.get().subscribe({
                next: (data) => {
                    this.center = data.data;
                    for (const cen of this.center) {
                        this.centers.push(cen.name);
                    }
                },
            });
        }
    }

    getLabsOrScans() {
        if (this.scanForm.value.area) {
            let a: Areas = this.area.find(
                (a) => a.name === this.scanForm.value.area
            )!;
            this.getSubAreaByArea(a.id);
        }
        if (this.scanForm.value.category && this.scanForm.value.subArea) {
            let a: SubAreaModel = this.subArea.find(
                (a) => a.name === this.scanForm.value.subArea
            )!;
            if (
                this.scanForm.value.category == 'Scan' ||
                this.scanForm.value.category == 'أشعة'
            ) {
                this.getScanBySubArea(a.id);
            } else if (
                this.scanForm.value.category == 'Lab' ||
                this.scanForm.value.category == 'معمل'
            ) {
                this.getLabsBySubArea(a.id);
            }
        } else if (this.scanForm.value.category && this.scanForm.value.area) {
            let a: Areas = this.area.find(
                (a) => a.name === this.scanForm.value.area
            )!;
            if (
                this.scanForm.value.category == 'Scan' ||
                this.scanForm.value.category == 'أشعة'
            ) {
                this.getScanByArea(a.id);
            } else if (
                this.scanForm.value.category == 'Lab' ||
                this.scanForm.value.category == 'معمل'
            ) {
                this.getLabsByArea(a.id);
            }
        } else if (this.scanForm.value.category) {
            if (
                this.scanForm.value.category == 'Scan' ||
                this.scanForm.value.category == 'أشعة'
            ) {
                this.getScans();
            } else if (
                this.scanForm.value.category == 'Lab' ||
                this.scanForm.value.category == 'معمل'
            ) {
                this.getLabs();
            }
        } else {
            this.getAllLabsAndScans();
        }
    }

    getLabs() {
        this.centers = [];
        return this._centerService.getLabs().subscribe((labs) => {
            this.center = labs.data;
            console.log(this.center);
            for (const cen of this.center) {
                this.centers.push(cen.name);
            }
        });
    }

    getLabsByArea(id: number) {
        this.centers = [];
        return this._centerService.getLabsByArea(id).subscribe((labs) => {
            this.center = labs.data;
            console.log(this.center);
            for (const cen of this.center) {
                this.centers.push(cen.name);
            }
        });
    }
    getLabsBySubArea(id: number) {
        this.centers = [];
        return this._centerService.getLabsBySubArea(id).subscribe((labs) => {
            this.center = labs.data;
            console.log(this.center);
            for (const cen of this.center) {
                this.centers.push(cen.name);
            }
        });
    }

    getScans() {
        this.centers = [];
        return this._centerService.getScans().subscribe((scans) => {
            this.center = scans.data;
            console.log(this.center);

            for (const cen of this.center) {
                this.centers.push(cen.name);
            }
        });
    }

    getScanByArea(id: number) {
        this.centers = [];
        console.log(this.center);

        return this._centerService.getScansByArea(id).subscribe((scans) => {
            this.center = scans.data;
            for (const cen of this.center) {
                this.centers.push(cen.name);
            }
        });
    }
    getScanBySubArea(id: number) {
        this.centers = [];
        console.log(this.center);

        return this._centerService.getScansBySubArea(id).subscribe((scans) => {
            this.center = scans.data;
            for (const cen of this.center) {
                this.centers.push(cen.name);
            }
        });
    }

    getSubAreaByArea(id: number) {
        this.subAreas = [];
        console.log('subArea By Area');
        this._areaService.getSubAreaByArea(id).subscribe({
            next: (data) => {
                this.subArea = data.data;
                for (const area of this.subArea) {
                    this.subAreas.push(area.name);
                }
                console.log(this.subAreas);
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    setScan() {
        let area = this.area.find((i) => i.name === this.scanForm.value.area);
        let subArea = this.subArea.find(
            (i) => i.name === this.scanForm.value.subArea
        );
        let cen = this.center.find((i) => {
            return i.name === this.scanForm.value.center;
        });
        // console.log(this.center);
        // this.getCenter();
        this.getLabsOrScans();
        this.areaId = area?.id;
        this.CenterId = cen?.id;
        this.subAreaId = subArea?.id;

        // console.log(area);
    }

    set() {
        let doc = this.doctors.find((i) => {
            return i.name === this.searchForm.value.doctor;
        });

        let cen = this.center.find((i) => {
            return i.name === this.searchForm.value.center;
        });

        let spec = this.specialty.find((i) => {
            return i.specialty === this.searchForm.value.specialty;
        });

        this.specialtyId = spec?.id;
        this.docId = doc?.id;
        this.CenterId = cen?.id;
    }
    showForm1() {
        this.form2 = false;
        this.form1 = true;
    }
    showForm2() {
        this.form1 = false;
        this.form2 = true;
    }
}
