import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Areas } from 'src/app/core/models/areas';
import { Centers } from 'src/app/core/models/centers';
import { Doctor } from 'src/app/core/models/doctor';
import { Settings } from 'src/app/core/models/settings';
import { Specialization } from 'src/app/core/models/specialization';
import { SubAreaModel } from 'src/app/core/models/sub-area-model';
import { AreaService } from 'src/app/core/services/area.service';
import { CentersService } from 'src/app/core/services/centers.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SpecializationService } from 'src/app/core/services/specialization.service';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
    mytime: Date = new Date();
    lang?: string;
    form1 = true;
    form2 = false;
    searchForm!: FormGroup;
    specialty: Specialization[] = [];
    doctors: Doctor[] = [];
    doctor: string[] = [];
    categories: string[] = [];
    specialties?: string[] = [];
    areas: string[] = [];
    area: Areas[] = [];
    centers: string[] = [];
    center: Centers[] = [];
    subAreas: string[] = [];
    subArea: SubAreaModel[] = [];
    subAreaId?: number;
    docId?: number;
    CenterId?: number;
    specialtyId?: number;
    areaId?: number;
    setting?: Settings;

    constructor(
        private _formBuilder: FormBuilder,
        public router: Router,
        private _specializations: SpecializationService,
        private _doctorService: DoctorService,
        private _areaService: AreaService,
        private _centerService: CentersService,
        private _settingsService: SettingsService
    ) {
        this.searchForm = _formBuilder.group({
            area: ['', [Validators.required]],
            subArea: ['', [Validators.required]],
            center: ['', [Validators.required]],
            specialty: ['', [Validators.required]],
            doctor: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }

        this.getSpecialties();
        this.getDoctor();
        this.getArea();
        this.getSubArea();
        this.getCenter();
        this.getSettings();
    }

    getSettings() {
        this._settingsService.get().subscribe({
            next: (data) => {
                this.setting = data.data[data.data.length - 1];
            },
            error: (err) => {
                console.error(err);
            },
        });
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
    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }
}
