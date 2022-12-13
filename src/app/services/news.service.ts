import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import {
  NewsResponse,
  Article,
  ArticlesByCategoryAndPage,
} from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) {}

  //Metodo para reducir el codigo en la peticion http
  private executeQuery<T>(endpoint: string) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey: apiKey,
        country: 'us',
      },
    });
  }

  //Metodo para llamar en el ngOnInit de la 1º pagina y traiga la categoria de technology
  getTopHeadlines(): Observable<Article[]> {
    return this.getTopHeadlinesByCategory('technology');
  }

  //Meotodo que trae los articulos por categoria
  getTopHeadlinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    if (this.articlesByCategoryAndPage[category]) {
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    //Si existe
    if (Object.keys(this.articlesByCategoryAndPage).includes(category)) {
    } else {
      // No existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: [],
      };
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(
      `/top-headlines?category=${category}&page=${page}`
    ).pipe(
      map(({ articles }) => {
        if (articles.length === 0)
          return this.articlesByCategoryAndPage[category].articles;

        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [
            ...this.articlesByCategoryAndPage[category].articles,
            ...articles,
          ],
        };

        return this.articlesByCategoryAndPage[category].articles;
      })
    );
  }
}
