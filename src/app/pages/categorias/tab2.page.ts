import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  //Utilizo el ViewChild para poder utilizar todas las funcionalides de este componente
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    //Trae los articulos de la categoria seleccionada
    this.newsService
      .getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe((articles) => {
        this.articles = [...articles];
      });
  }

  //Capturar el valor del evento y así poder filtrar por categorias
  segmentChanged(event: Event) {
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService
      .getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe((articles) => {
        this.articles = [...articles];
      });
  }

  //Cargar mas articulos en funcion de la categoria seleccionada
  loadData() {
    this.newsService
      .getTopHeadlinesByCategory(this.selectedCategory, true)
      .subscribe((articles) => {
        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          return;
        }

        this.articles = articles;
        this.infiniteScroll.complete();
      });
  }
}
