import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../api/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from '../../auth/logout/logout.component';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() toggleEventEmitter = new EventEmitter<void>();
    public emitToggle(): void {
        this.toggleEventEmitter.emit();
    }

    @Output() eventEmitter = new EventEmitter<string>();
    click(value: string) {
        this.eventEmitter.emit(value);
    }

    private authSubscription!: Subscription;
    isAuthenticated = signal(false);

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authSubscription = this.authService.currentUser$.subscribe(isAuthenticated => {
            this.isAuthenticated.set(isAuthenticated);
        });
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

    readonly dialog = inject(MatDialog);

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog.open(LogoutComponent, {
            width: '400px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }
}
