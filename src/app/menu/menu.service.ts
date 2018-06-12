import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MenuService {
  constructor(private http: HttpClient) {}

  createMenuItem(menuItemData) {
    console.log('asdadasd');
    return this.http.post("/api/menuItem" , menuItemData);
  }

  getMenu() {
    return this.http.get('/api/menu');
  }

  getMenuItemById(id: string) {
    return this.http.get('/api/menuItem/' + id);
  }

  // deleteMenuItem(id: string){
  //   return this.http.delete('api/menuItem/' + id)
  // }

  getFavourites() {
    return this.http.get('/api/favourites/add');
  }
}
