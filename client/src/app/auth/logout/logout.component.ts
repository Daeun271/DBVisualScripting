import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { AuthService } from '../../../api/auth.service';

@Component({
    selector: 'app-logout',
    imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatButtonModule],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LogoutComponent {
    readonly dialogRef = inject(MatDialogRef<LogoutComponent>);

    constructor(private authService: AuthService) { }

    logOut(): void {
        this.authService.logout().subscribe({
            next: () => {
                this.authService.logout();
                this.dialogRef.close();
            }
        });
    }
}
