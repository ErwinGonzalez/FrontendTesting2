import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {

  private angForm: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.angForm = this.fb.group({
      ConditionSelect : ['Equal', Validators.required],
    });
    console.log(this.angForm.controls.ConditionSelect.value)
    
  }

  onValChange(value: any){
    console.log(value);
  }
}
