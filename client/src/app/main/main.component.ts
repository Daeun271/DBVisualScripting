import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
    selector: 'app-main',
    imports: [HeaderComponent, ContentComponent, SidebarComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
    isSidebarOpen = true;

    constructor(private sidebarService: SidebarService) { }

    ngOnInit() {
        this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
            this.isSidebarOpen = isOpen;
        });
    }
}
