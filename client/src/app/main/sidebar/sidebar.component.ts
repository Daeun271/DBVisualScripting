import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
    selector: 'app-sidebar',
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
    isOpen: boolean = true;

    constructor(private sidebarService: SidebarService) { }

    ngOnInit(): void {
        this.sidebarService.isSidebarOpen$.subscribe((isOpen: boolean) => {
            this.isOpen = isOpen;
        });
    }
}
