import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { About } from 'src/app/core/models/about';
import { AboutService } from 'src/app/core/services/about.service';

@Component({
    selector: 'app-why-choose-us',
    templateUrl: './why-choose-us.component.html',
    styleUrls: ['./why-choose-us.component.scss'],
})
export class WhyChooseUsComponent implements OnInit {
    lang?: string;
    about!: About;
    constructor(public router: Router, private _aboutService: AboutService) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }

        this.getAbout();
    }

    getAbout() {
        return this._aboutService.get().subscribe({
            next: (data) => {
                this.about = data.data[data.data.length - 1];
            },
            error: (err) => {
                console.error(err);
            },
        });
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
