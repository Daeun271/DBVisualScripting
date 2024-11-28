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

@Component({
    selector: 'app-auth',
    imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
    @Input() isRegister = false;

    username = '';
    readonly email = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]);
    readonly password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]);

    constructor() {
        merge(this.email.statusChanges, this.email.valueChanges, this.password.statusChanges, this.password.valueChanges)
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
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
        this.username = '';
        this.email.reset('');
        this.password.reset('');
        this.emailErrorMessage.set('');
        this.passwordErrorMessage.set('');
    }

    emailErrorMessage = signal('');

    updateEmailErrorMessage() {
        if (this.email.hasError('required')) {
            this.emailErrorMessage.set('You must enter a value');
        } else if (this.email.hasError('pattern')) {
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

    hide = signal(true);
    toggle(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    validateFields(): boolean {
        this.email.markAsTouched();
        this.password.markAsTouched();

        if (this.email.invalid || this.password.invalid) {
            this.updateEmailErrorMessage();
            this.updatePasswordErrorMessage();

            return false;
        }

        return true;
    }

    register() {
        if (!this.validateFields()) {
            return;
        }

        // todo: register
    }

    logIn() {
        if (!this.validateFields()) {
            return;
        }

        // todo: log in
    }
}
