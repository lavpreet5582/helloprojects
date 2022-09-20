import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from './model/iTasks';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  url = environment.BASE_API_URL;

  constructor(private http: HttpClient) { }


  getTodoTasks() {
    return this.http.get<ITask[]>(this.url + 'Todo')
  }

  getInProgressTasks() {
    return this.http.get<ITask[]>(this.url + 'InProgress')
  }
  getDoneTasks() {
    return this.http.get<ITask[]>(this.url + 'Done')
  }
  addTask(item: any) {
    return this.http.post(this.url + 'Todo', item)
  }

  moveTask(to: any, item: any) {
    return this.http.post(this.url + to, item)
  }

  deleteTask(list: any, id: number) {
    return this.http.delete(this.url + list + '/' + id)
  }

  updateTask(id: number, item: any) {
    return this.http.patch(this.url + 'Todo/' + id, item)
  }


  private _listners = new Subject<any>();
  listen() {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy)
  }


  register(data: any) {
    return this.http.post(this.url + 'user/register/', data)
  }

  login(data: any) {
    return this.http.post(this.url + 'login', data)
  }
}
