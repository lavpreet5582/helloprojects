import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  todoForm!: FormGroup
  isEditEnabled: boolean = false
  User:any
  constructor(private fb: FormBuilder, private _service: SharedService, private dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  public closeMe() {
    this.dialogRef.close();
    // window.location.reload()
    this._service.filter('Register')
    
  }
  ngOnInit(): void {
    this.User = localStorage.getItem("user")
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    })
    this.isEditEnabled = this.data.isEditEnabled
    
  }

  addTask() {
    
    console.log(this.User);
    let fname = this.User.split('@')[0] 
    let data = {
      author:fname,
      author_mail:this.User,
      description: this.todoForm.value.item,
      done: false
    }

    this._service.addTask(data).subscribe((res: any) => {
      console.log(res);

      // this.tasks.push({
      //   id: res.id,
      //   description: res.description,
      //   done: res.done
      // })

    })

    this.todoForm.reset()
    this.closeMe()

  }

  updateTask() {
    let id = this.data.item.id
    let data = {
      description: this.todoForm.value.item
    }

    this._service.updateTask(id, data).subscribe((res: any) => {
      console.log(res);

    })

    this.todoForm.reset()
    this.closeMe()

    // console.log(id);
    
  }

}
