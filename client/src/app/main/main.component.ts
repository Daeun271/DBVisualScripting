import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth/auth.component';

@Component({
    selector: 'app-main',
    imports: [HeaderComponent, ContentComponent, SidebarComponent, CommonModule, AuthComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
})
export class MainComponent {
    isSidebarOpen = true;


    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    isAuth = false;
    isRegisterMode = false;

    setCurrentContent(content: String) {
        this.isAuth = content === 'register' || content === 'login';
        this.isRegisterMode = content === 'register';
    }
}
