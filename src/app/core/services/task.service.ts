import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../interfaces/Task';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  tasks = signal<Task[]>([]);

  getTasks(): void {
    this.http
      .get<Task[]>(this.apiUrl)
      .subscribe((tasks) => this.updateListTasks(tasks));
  }

  addTask({ title, description }: Task) {
    const newTask: Task = {
      id: this.generateId(),
      title,
      description,
      createdAt: new Date(),
      completed: false,
    };

    const tasks = [...this.tasks(), newTask];
    this.updateListTasks(tasks);
  }

  updateTask(id: string, task: Task) {
    const { title, description } = task;
    const updatedTask: Task = {
      ...task,
      id,
      title,
      description,
      createdAt: new Date(),
    };

    const tasks = this.tasks().map((t) => (t.id === id ? updatedTask : t));
    this.updateListTasks(tasks);
  }

  deleteTask(id: string) {
    const tasks = this.tasks().filter((t) => t.id !== id);
    this.updateListTasks(tasks);
  }

  toggleTaskCompletion(id: string) {
    const tasks = this.tasks().map((t) => {
      if (t.id === id) {
        t.completed = !t.completed;
      }

      return t;
    });

    this.updateListTasks(tasks);
  }

  private updateListTasks(tasks: Task[]) {
    this.tasks.set(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  private generateId(): string {
    return uuidv4();
  }
}
