import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  get getLocalArticles() {
    return [...this._localArticles];
  }

  //Metodo para iniciar el storage que es lo que va a servir para guardar en fav
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }
//Eliminar articule del storage
  deleteArticle(article: Article) {
    this._localArticles = this._localArticles.filter(
      (localArticle) => localArticle.title !== article.title
    );
  }

  //Pruebas de 
  includeArticle(article: Article) {
    this._localArticles = [article, ...this._localArticles];
    this._storage.set('articles', this._localArticles);
  }

  async loadFavorites() {
    try {
      const articles = await this._storage.get('articles');
      this._localArticles = articles || [];
    } catch (error) {}
  }

  articleInFavorites(article: Article): boolean {
    //Busca los articulos del storage y devuelve los que tengan un title diferente.
    //Esto es para filtrar los articulos del storage
    return !!this._localArticles.find(
      (localArticle) => localArticle.title === article.title
    );
  }
}
