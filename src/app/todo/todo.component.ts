import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ITask } from '../model/iTasks';
import { SharedService } from '../shared.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
// import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})



export class TodoComponent implements OnInit {
  todoForm !: FormGroup;
  tasks: ITask[] = []
  inprogress: ITask[] = []
  done: ITask[] = []
  updateId !: any;
  isEditEnabled: boolean = false
  user:any
  user_mail:any
  constructor(private  dialog:  MatDialog, private _service: SharedService, private fb: FormBuilder, private dialogRef:MatDialogRef<ModalComponent>) { 
    this._service.listen().subscribe((res:any)=>{
      console.log(res);
      this.getAllTasks();
      
    })
  }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required]
    })
    this.user = localStorage.getItem("user")
    this.getAllTasks()
  }


  getAllTasks() {
    console.log(this.user.email)
    this._service.getTodoTasks().subscribe((res) => {
      this.tasks= res.filter(item => 
        item.author_mail === this.user
      )
      
    })
    this._service.getInProgressTasks().subscribe((res) => {
      this.inprogress = res.filter(item=>
        item.author_mail === this.user
      )
    })
    this._service.getDoneTasks().subscribe((res) => {
      this.done = res.filter(item=>
        item.author_mail === this.user
      )
    })
  }

  drop(event: CdkDragDrop<ITask[]>) {
    let from_id = event.previousContainer.id.split('-')[3]
    let to_id = event.container.id.split('-')[3]
    let from_list;
    let to_list;
    if (from_id == '0') {
      from_list = 'Todo'
    } else if (from_id == '1') {
      from_list = 'InProgress'
    } else if (from_id == '2') {
      from_list = 'Done'
    }

    if (to_id == '0') {
      to_list = 'Todo'
    } else if (to_id == '1') {
      to_list = 'InProgress'
    } else if (to_id == '2') {
      to_list = 'Done'
    }

    // console.log(from_list, to_list);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.dragDropData(from_list, to_list, event.container.data)

  }

  dragDropData(from: any, to: any, data: any) {

    let newdata = {
      author:data[0].author,
      author_mail:data[0].author_mail,
      description: data[0].description,
      done: data[0].done
    }

    this._service.deleteTask(from, data[0].id).subscribe((res: any) => {
      console.log(res);

    })
    this._service.moveTask(to, newdata).subscribe((res: any) => {
      console.log(res);

    })
    setTimeout(()=>{
      this.getAllTasks()
    },500)
    
  }
  
  openAddModal(){
    this.dialog.open(ModalComponent,{
      data:{
        
      }
    })
  }
  openEditModal(item:ITask){
    this.dialog.open(ModalComponent,{
      data:{
        item:item
      }
    })
  }
  
  // addTask() {

  //   let data = {
  //     description: this.todoForm.value.item,
  //     done: false
  //   }

  //   this._service.addTask(data).subscribe((res: any) => {
  //     // console.log(res);

  //     this.tasks.push({
  //       id: res.id,
  //       description: res.description,
  //       done: res.done
  //     })

  //   })

  //   this.todoForm.reset()
  // }
  // updateTask() {
  //   this.tasks[this.updateId].description = this.todoForm.value.item
  //   this.tasks[this.updateId].done = false
  //   this.todoForm.reset()
  //   this.updateId = undefined;
  //   this.isEditEnabled = false;
  // }
  deleteTask(item: ITask,list_name:any) {
    this._service.deleteTask(list_name, item.id).subscribe((res: any) => {
      console.log(res);

    })
    this.getAllTasks()
  }

  editTask(item: ITask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateId = i;
    this.isEditEnabled = true;
    this.openEditModal(item)
  }

}
