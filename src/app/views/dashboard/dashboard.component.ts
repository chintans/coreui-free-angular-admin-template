import { NgStyle } from '@angular/common';
import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  WidgetStatBComponent,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, NgStyle, CardFooterComponent, GutterDirective, ProgressComponent, CardHeaderComponent, TableDirective, AvatarComponent, RouterLink, WidgetStatBComponent, BadgeComponent]
})
export class DashboardComponent implements OnInit {
  public projects = [
    {
      id: 1,
      name: 'Go-To-Market Strategy',
      client: 'Acme Corp',
      status: 'In Progress',
      progress: 45,
      color: 'info'
    },
    {
      id: 2,
      name: 'Consumer Research',
      client: 'Globex Inc',
      status: 'Action Required',
      progress: 10,
      color: 'warning'
    },
    {
      id: 3,
      name: 'Strategy Review',
      client: 'Soylent Corp',
      status: 'Under Review',
      progress: 80,
      color: 'success'
    }
  ];

  ngOnInit(): void {
  }
}
