import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Pollution} from '../../models/pollution.model';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';

@Component({
  selector: 'app-pollution-recap',
  imports: [],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.scss'
})
export class PollutionRecap {
  @Input({ required: true }) pollution!: Pollution;

  @Output() backToList = new EventEmitter<void>();

  onBackToList() {
    this.backToList.emit();
  }

  getTypeLabel(type: string): string {
    return type;
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'EEEE d MMMM yyyy', { locale: fr });
  }
}
