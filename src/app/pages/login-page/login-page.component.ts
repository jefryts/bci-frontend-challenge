import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError,
  ],
})
export class LoginPageComponent {
  private readonly authService: AuthService = inject(AuthService);

  private readonly dialog: MatDialog = inject(MatDialog);

  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  loginForm = signal<FormGroup>(
    this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.smartjobEmailValidator(),
        ],
      ],
    })
  );

  private smartjobEmailValidator(): ValidatorFn {
    const regex = /^[a-zA-Z0-9._-]+@smartjob\.com$/;
  
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; //Esto para que no valide si está vacío (eso lo validará Validators.required)
  
      return regex.test(value) ? null : { smartjobEmail: true };
    };
  }

  async onSubmit() {
    if (!this.loginForm().valid) return;

    const emailValue = this.loginForm().get('email')?.value?.trim();

    if (!emailValue) {
      this.snackBar.open('Por favor ingrese un correo válido', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const { exists } = await lastValueFrom(
      this.authService.userExists(emailValue)
    );

    if (exists) {
      this.authService.login(emailValue);
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Usuario no encontrado',
          message: '¿Deseas crear un usuario con este correo?',
          confirmText: 'Crear',
          cancelText: 'Cancelar',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.authService.register(emailValue);
        }
      });
    }
  }
}
