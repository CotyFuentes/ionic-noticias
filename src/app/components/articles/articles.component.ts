import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {

  //Traigo el array de article con el input y asi puedo hacer el *ngFor en la vista
  @Input() articles: Article[] = [];

  constructor() { }

}
