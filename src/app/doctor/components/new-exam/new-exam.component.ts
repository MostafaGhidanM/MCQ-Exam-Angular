import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { DoctorService } from '../../services/doctor.service';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss']
})
export class NewExamComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  name = new FormControl('')
  id: any;
  questionForm!: FormGroup
  questions: any[] = []
  correctNum: any;
  stepperIndex = 0;
  subjectName: string = '';
  startAdd: boolean = false;
  preview: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.createForm()
  }
  createForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required],
    })
  }

  submit() {
    const model = {
      name: this.name.value,
      questions: this.questions
    }
    this.doctorService.createSubject(model).subscribe((res: any) => {
      this.id = res.id
      this.preview = true;
      setTimeout(() => {
        this.stepper.next(); // Move to the next step
      });
      this.toastr.success('Exam added Successfully')
    }
      , error => {

      })
    console.log(`From submit().....`)
    console.log(this.questions)

  }

  createQuestion() {

    if (this.correctNum) {
      const newQuestion = {
        question: this.questionForm.value.question,
        answer1: this.questionForm.value.answer1,
        answer2: this.questionForm.value.answer2,
        answer3: this.questionForm.value.answer3,
        answer4: this.questionForm.value.answer4,
        correctAnswer: this.questionForm.value[this.correctNum]
      };

      const exists = this.questions.some(question => {
        return question.question === newQuestion.question &&
          question.answer1 === newQuestion.answer1 &&
          question.answer2 === newQuestion.answer2 &&
          question.answer3 === newQuestion.answer3 &&
          question.answer4 === newQuestion.answer4 &&
          question.correctAnswer === newQuestion.correctAnswer;
      });

      if (!exists) {
        this.questions.push(newQuestion);
        this.questionForm.reset();
        this.correctNum = null
      } else {
        this.toastr.warning('السؤال موحود مسبقا');
      }
    } else {
      this.toastr.error('يرجى اختيار الإجابة الصحيحة')
    }
    console.log(`From save().....`)
    console.log(this.questions)
  }

  getCorrect(event: any) {
    this.correctNum = event.value
  }

  start() {
    if (this.name.value == '') {
      this.toastr.error('يرجى إدخال اسم المادة')
    } else {
      this.startAdd = true
      this.subjectName = this.name.value;
      setTimeout(() => {
        this.stepper.next(); // Move to the next step
      });
    }
    console.log(`From start().....`)
    console.log(this.questions)
  }
  clearForm() {
    this.questionForm.reset()
  }
  cancel() {
    this.questionForm.reset()
    this.questions = []
    this.subjectName = ''
    this.name.reset()
    this.startAdd = false
  }
  delete(index: number) {
    this.questions.splice(index, 1)

    console.log(`From delete().....`)
    console.log(this.questions)
  }

}
