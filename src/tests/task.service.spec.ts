import { TestBed } from '@angular/core/testing';
import { TaskService } from '../app/core/services/task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new task', () => {
    const task: any = {
      title: 'Test Task',
      description: 'Description',
    };
    service.addTask(task);

    const tasks = service.tasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Test Task');
  });

  it('should toggle task completion', () => {
    const task: any = {
      title: 'Test Task',
      description: 'Description',
    };
    service.addTask(task);

    const tasks = service.tasks();
    service.toggleTaskCompletion(tasks[0].id);
    expect(service.tasks()[0].completed).toBeTrue();
  });

  it('should delete a task', () => {
    const task: any = {
      title: 'Test Task to delete',
      description: 'Description',
    };
    service.addTask(task);

    const tasks = service.tasks();
    service.deleteTask(tasks[0].id);
    expect(service.tasks().length).toBe(0);
  });
});
