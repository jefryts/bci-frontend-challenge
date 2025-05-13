import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { Task } from '../../core/interfaces/Task';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss'],
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgClass,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatError,
  ],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class TaskPageComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  private readonly authService: AuthService = inject(AuthService);

  private readonly taskService: TaskService = inject(TaskService);

  private readonly dialog: MatDialog = inject(MatDialog);

  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  isLoading: boolean = false;

  taskList = this.taskService.tasks;

  editingTask = signal<boolean>(false);

  taskForm = signal<FormGroup>(
    this.formBuilder.group({
      id: [null],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.withoutSpaces,
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          this.withoutSpaces,
        ],
      ],
      completed: [false],
    })
  );

  ngOnInit(): void {
    this.taskService.getTasks();
  }

  private withoutSpaces(control: AbstractControl): ValidationErrors | null {
    const value = control.value ?? '';
    return value.trim().length === 0 ? { soloEspacios: true } : null;
  }

  addOrUpdateTask() {
    if (!this.taskForm().valid) return;
    this.isLoading = true;
    const taskData = this.taskForm().value;

    const existingTask = this.taskList().some(
      (t) =>
        t.title.trim().toLowerCase() === taskData.title.trim().toLowerCase()
    );

    if (existingTask) {
      this.taskForm().setErrors({ taskDuplicated: true });
      return;
    }

    if (this.editingTask()) {
      this.taskService.updateTask(taskData.id, taskData);
      this.showMessage('✏️ Tarea actualizada con éxito.');
    } else {
      this.taskService.addTask(taskData);
      this.showMessage('✅ Tarea añadida con éxito.');
    }

    this.resetForm();
    this.isLoading = false;
  }

  startEditing(task: Task) {
    this.taskForm().patchValue(task);
    this.editingTask.set(true);
  }

  toggleTaskCompletion(taskId: string | undefined) {
    if (!taskId) return;

    this.taskService.toggleTaskCompletion(taskId);
    this.showMessage('🔄 Estado de la tarea actualizado.');
  }

  deleteTask(taskId: string | undefined) {
    if (!taskId) return;

    const dialogRef = this.showModalConfirm(
      '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.'
    );

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.taskService.deleteTask(taskId);
          this.showMessage('🗑️ Tarea eliminada con éxito.');
        }
      });
  }

  logout() {
    const dialogRef = this.showModalConfirm(
      '¿Seguro que quieres cerrar sesión?'
    );

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.authService.logout();
        }
      });
  }

  resetForm() {
    this.taskForm().reset();
    this.formDirective.resetForm();
    this.editingTask.set(false);
  }

  private showMessage(message: string) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: { message },
      panelClass: 'custom-dialog',
    });
  }

  private showModalConfirm(message: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message,
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });
  }

  ngOnDestroy() {
    this.taskList.set([]);
  }
}
