import { Component, Input } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  AlertController,
  Platform,
} from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { StorageService } from '../../services/storage.service';

import { Article } from '../../interfaces';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  //Traigo la interfaz article
  @Input() article: Article;
  @Input() index: number;

  message: string = '';

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService,
    private alertController: AlertController
  ) {}

  openArticle() {
    //Metodo que abre el articulo en el navegador del movil si está en una de estas plataformas
    if (this.platform.is('ios') || this.platform.is('android')) {
      //Doc de ionic
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    //Si estamos en pc abre en navegador en otra ventana
    window.open(this.article.url, '_blank');
  }

  //Meotod asincrono para que espere a que se cree el menu y despues añadir los boton
  async onOpenMenu() {
    const articleInFavorite = this.storageService.articleInFavorites(
      this.article
    );

    const normalBtns: ActionSheetButton[] = [
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
      },
    ];

    const btnEliminar: ActionSheetButton = {
      text: 'Eliminar de favoritos',
      icon: 'star',
      handler: () => this.alertEliminar(),
    };

    const btnanyadir: ActionSheetButton = {
      text: 'Añadir en favoritos',
      icon: 'star-outline',
      handler: () => this.alertAnyadir(),
    };

    //condicion para que sepa si está el articulo en fav y así mostrar un button u otro
    if (articleInFavorite) {
      normalBtns.unshift(btnEliminar);
    } else {
      normalBtns.unshift(btnanyadir);
    }

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };

    //Condicion para mostrar el button si estamos en dicha plataforma
    if (this.platform.is('capacitor')) {
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns,
    });

    await actionSheet.present();
  }

  onShareArticle() {
    //Desestrcturacion del articulo para evitar poner le this. Esto se hace como una refactorizacion de codigo vista en stackoverflow
    const { title, source, url } = this.article;

    this.socialSharing.share(title, source.name, null, url);
  }

  //Metodo para lanzar el alert al añadir a fav
  async alertAnyadir() {
    const alert = await this.alertController.create({
      header: '¿Quieres añadir la noticia a favoritos?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: () => {
            this.message = 'Ok, no has añadido ningna noticia a favoritos';
          },
        },
        {
          text: 'Ok',
          role: 'confirm',
          cssClass: 'alert-button-confirm ',
          handler: () => {
            this.storageService.includeArticle(this.article);
          },
        },
      ],
    });

    await alert.present();
  }

  //Metodo lanzar alert al eliminar
  async alertEliminar() {
    const alert = await this.alertController.create({
      header: 'Seguro que quieres eliminar la noticia de favoritos?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: () => {
            this.message;
          },
        },
        {
          text: 'Ok',
          role: 'confirm',
          cssClass: 'alert-button-cancel',
          handler: () => {
            this.storageService.deleteArticle(this.article);
          },
        },
      ],
    });

    await alert.present();
  }
}
