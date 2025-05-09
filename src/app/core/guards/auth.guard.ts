import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const existsUserToken = !!authService.getToken(); // Verifica si hay un usuario autenticado

  if (!existsUserToken) {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false;
  }

  return true;
};
