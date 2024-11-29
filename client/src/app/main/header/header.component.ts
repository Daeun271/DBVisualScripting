import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../sidebar/sidebar.service';
import { Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
    private authSubscription!: Subscription;
    isAuthenticated = false;

    constructor(private sidebarService: SidebarService, private authService: AuthService) { }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

    @Output() eventEmitter = new EventEmitter<string>();
    click(value: string) {
        this.eventEmitter.emit(value);
    }

    ngOnInit() {
        this.authSubscription = this.authService.currentUser$.subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
        });
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }
}
