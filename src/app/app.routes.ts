import { Routes } from '@angular/router';
import { TaskPageComponent } from './pages/task-page/task-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: TaskPageComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: '**', redirectTo: '' },
];
