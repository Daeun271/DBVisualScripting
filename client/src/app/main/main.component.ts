import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService } from './sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth/auth.component';

@Component({
    selector: 'app-main',
    imports: [HeaderComponent, ContentComponent, SidebarComponent, CommonModule, AuthComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
    isSidebarOpen = true;
    isAuth = false;
    isRegisterMode = false;

    constructor(private sidebarService: SidebarService) { }

    ngOnInit() {
        this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
            this.isSidebarOpen = isOpen;
        });
    }

    setCurrentContent(content: String) {
        this.isAuth = content === 'register' || content === 'login';
        this.isRegisterMode = content === 'register';
    }
}
