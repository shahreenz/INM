import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { timeRegex } from '../_helpers';
import { Inmate } from '../_models';
import { InmateService } from '../_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  host: {
    class: 'full-width'
  }
})



export class BookingComponent implements OnInit {
  public bookingForm: FormGroup;
  public submitted: boolean = false;
  maxDate = new Date();
  maxDateBirth = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private inmateService: InmateService
 
  ) {
    this.maxDateBirth.setMonth(this.maxDate.getMonth() - 12 * 18);
  }

  public ngOnInit(): void {
    this.initialiseForm();
  }

  /**
   * Initialise the form group
   */
  private initialiseForm(): void {
    this.bookingForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      surname: [null, Validators.required],
      dob: [null, Validators.required],
      arrivalDate: [null, Validators.required],
      arrivalTime: [null, Validators.required]
    });
  }

  /**
   * If valid, process the data and store in the DB
   */
  public onSubmit(): void {
    this.submitted = true;

    if (!this.bookingForm.valid) return;

    const {
      firstName,
      surname,
      dob,
      arrivalDate,
      arrivalTime
    } = this.bookingForm.value;
    const inmate: Inmate = {
      id: null,
      referenceNumber: null,
      name: `${firstName} ${surname}`,
      arrivalDate,
      arrivalTime,
      dob
    };

    this.inmateService.checkIn({ ...inmate }).subscribe(
      (res: { message: string }) => {
        this.snackBar.open('Inmate checked in successfully');
        this.router.navigate(['/']);
      },
      (err: any) => console.error(err)
    );
  }
}
