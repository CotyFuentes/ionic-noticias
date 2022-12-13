// Generada por https://quicktype.io ya que lo hace automaticamente

//Para manejar la 1º respuesta
export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}
//Manejar los articulos
export interface Article {
  source: Source;
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
}

export interface Source {
  id?: string;
  name: string;
}

//Interface creada para manejar los articulos mas facil
export interface ArticlesByCategoryAndPage {
  [key: string]: {
    page: number;
    articles: Article[];
  };
}
