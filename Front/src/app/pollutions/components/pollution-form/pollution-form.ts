import {Component, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from "@angular/forms";
import {PollutionService} from '../../services/pollution';
import {Pollution} from '../../models/pollution.model';
import {CreatePollutionDto, UpdatePollutionDto} from '../../models/pollution.dto';
import {POLLUTION_TYPES} from '../../models/pollution.constants';
import {PollutionRecap} from '../pollution-recap/pollution-recap';
import { isAfter, endOfDay, parseISO, format } from 'date-fns';

function noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const selectedDate = parseISO(control.value);
  const today = endOfDay(new Date());

  if (isAfter(selectedDate, today)) {
    return { futureDate: true };
  }

  return null;
}

@Component({
  selector: 'app-pollution-form',
  imports: [
    ReactiveFormsModule,
    PollutionRecap,
    RouterLink
  ],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.scss'
})
export class PollutionForm implements OnInit {
  private fb = inject(FormBuilder);
  private pollutionService = inject(PollutionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pollutionId = signal<number | null>(null);
  pollutionToEdit = signal<Pollution | null>(null);

  pollutionForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  showForm = signal(true);
  submittedPollution = signal<Pollution | null>(null);

  readonly pollutionTypes = POLLUTION_TYPES;

  constructor() {
    this.pollutionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['Plastique', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateObservation: ['', [Validators.required, noFutureDateValidator]],
      location: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.pattern(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/)]],
      photoUrl: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pollutionId.set(Number(id));
      this.loadPollution(Number(id));
    }
  }

  loadPollution(id: number) {
    this.loading.set(true);
    this.pollutionService.getPollutionById(id).subscribe({
      next: (pollution) => {
        this.pollutionToEdit.set(pollution);
        this.pollutionForm.patchValue({
          title: pollution.title,
          type: pollution.type,
          description: pollution.description,
          dateObservation: this.formatDateForInput(pollution.dateObservation),
          location: pollution.location,
          latitude: pollution.latitude,
          longitude: pollution.longitude,
          photoUrl: pollution.photoUrl || ''
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement de la pollution');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  // Convertit la date au format YYYY-MM-DD requis par l'input HTML type="date", sinon la valeur n'est pas affichée
  private formatDateForInput(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'yyyy-MM-dd');
  }

  get isEditMode(): boolean {
    return this.pollutionId() !== null;
  }

  onSubmit() {
    if (this.pollutionForm.valid) {
      if (this.isEditMode) {
        this.loading.set(true);
        this.error.set(null);

        const updateDto: UpdatePollutionDto = {
          ...this.pollutionForm.value
        };

        const id = this.pollutionId()!;
        this.pollutionService.updatePollution(id, updateDto).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/pollutions/list']);
          },
          error: (err) => {
            this.error.set('Erreur lors de la modification');
            this.loading.set(false);
            console.error(err);
          }
        });
      } else {
        this.loading.set(true);
        this.error.set(null);

        const createDto: CreatePollutionDto = this.pollutionForm.value;

        this.pollutionService.createPollution(createDto).subscribe({
          next: (createdPollution) => {
            this.loading.set(false);
            this.submittedPollution.set(createdPollution);
            this.showForm.set(false);
          },
          error: (err) => {
            this.error.set('Erreur lors de la création de la pollution');
            this.loading.set(false);
            console.error(err);
          }
        });
      }
    } else {
      Object.keys(this.pollutionForm.controls).forEach(key => {
        this.pollutionForm.controls[key].markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/pollutions/list']);
  }

  onBackToList() {
    this.router.navigate(['/pollutions/list']);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.pollutionForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
