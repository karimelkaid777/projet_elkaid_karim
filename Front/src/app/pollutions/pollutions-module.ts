import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollutionsRoutingModule } from './pollutions-routing-module';
import { PollutionList } from './components/pollution-list/pollution-list';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionDetail } from './components/pollution-detail/pollution-detail';
import { PollutionRecap } from './components/pollution-recap/pollution-recap';
import { PollutionService } from './services/pollution';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PollutionsRoutingModule,
    PollutionList,
    PollutionForm,
    PollutionDetail,
    PollutionRecap
  ],
  providers: [PollutionService]
})
export class PollutionsModule { }
