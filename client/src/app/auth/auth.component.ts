import { Component, Input, signal, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { register, login } from '../../api';
import { Output, EventEmitter } from '@angular/core';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-auth',
    imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
    @Input() isRegister = false;

    readonly username = new FormControl('', [Validators.maxLength(25)]);
    readonly email = new FormControl('', [Validators.required, Validators.email]);
    readonly password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]);

    constructor(private authService: AuthService) {
        merge(this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
                this.updateUsernameErrorMessage();
                this.updateEmailErrorMessage();
                this.updatePasswordErrorMessage();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isRegister']) {
            this.resetForm();
        }
    }

    resetForm() {
        this.username.reset('');
        this.email.reset('');
        this.password.reset('');
        this.emailErrorMessage.set('');
        this.passwordErrorMessage.set('');
    }

    emailErrorMessage = signal('');

    updateEmailErrorMessage() {
        if (this.email.hasError('required')) {
            this.emailErrorMessage.set('You must enter a value');
        } else if (this.email.hasError('email')) {
            this.emailErrorMessage.set('Not a valid email');
        } else {
            this.emailErrorMessage.set('');
        }
    }

    passwordErrorMessage = signal('');

    updatePasswordErrorMessage() {
        if (this.password.hasError('required')) {
            this.passwordErrorMessage.set('You must enter a value');
        } else if (this.password.hasError('minlength')) {
            this.passwordErrorMessage.set('Password must be at least 8 characters long');
        } else if (this.password.hasError('maxlength')) {
            this.passwordErrorMessage.set('Password must be at most 16 characters long');
        } else if (this.password.hasError('pattern')) {
            this.passwordErrorMessage.set('Password must contain at least one letter and one number');
        } else {
            this.passwordErrorMessage.set('');
        }
    }

    usernameErrorMessage = signal('');

    updateUsernameErrorMessage() {
        if (this.username.hasError('maxlength')) {
            this.usernameErrorMessage.set('Username must be at most 25 characters long');
        } else {
            this.usernameErrorMessage.set('');
        }
    }

    hide = signal(true);
    toggle(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    validateFields(): boolean {
        this.username.markAsTouched();
        this.email.markAsTouched();
        this.password.markAsTouched();

        if (this.username.invalid || this.email.invalid || this.password.invalid) {
            this.updateUsernameErrorMessage();
            this.updateEmailErrorMessage();
            this.updatePasswordErrorMessage();

            return false;
        }

        return true;
    }

    @Output() onSucess = new EventEmitter<String>();

    register() {
        if (!this.validateFields()) {
            return;
        }

        this.authService.register(this.username.value!, this.email.value!, this.password.value!)
            .subscribe({
                next: () => {
                    this.onSucess.emit('home');
                    this.resetForm();
                },
                error: (error) => {
                    console.error('Registration failed', error);
                    // Handle registration error (show message, etc.)
                }
            });
    }

    logIn() {
        if (!this.validateFields()) {
            return;
        }

        this.authService.login(this.email.value!, this.password.value!)
            .subscribe({
                next: () => {
                    this.onSucess.emit('home');
                    this.resetForm();
                },
                error: (error) => {
                    console.error('Login failed', error);
                    // Handle login error (show message, etc.)
                }
            });
    }
}
