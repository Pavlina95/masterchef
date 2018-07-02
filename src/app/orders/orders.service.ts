import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OrdersService {
  constructor(private http: HttpClient) {}

  orderItemsCountChanged = new Subject<number>();
  currentAddressId: number;
 
  setHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('jwtToken')
      })
    };
  }

  addMenuItem(id: number) {
    const currentOrders = JSON.parse(sessionStorage.getItem('orders')) || [];
    const existedMenuItems = currentOrders.filter(order => order.id === id);

    if (existedMenuItems.length === 0) {
      currentOrders.push({
        id: id,
        count: 1
      });
    } else {
      currentOrders.map(order => {
        if (id === order.id) {
          order.count += 1;
        }
        return order;
      });
    }
    sessionStorage.setItem('orders', JSON.stringify(currentOrders));
    this.orderItemsCountChanged.next(this.getOrderItemsCount());
  }

  removeMenuItem(id: number) {
    let currentOrders = JSON.parse(sessionStorage.getItem('orders')) || [];
    const existedMenuItems = currentOrders.filter(order => order.id === id);

    if (existedMenuItems.length === 0) {
      this.deleteItem(id);
    } else {
      currentOrders = currentOrders.map(order => {
        if (id === order.id) {
          order.count -= 1;
        }

        return order;
      });

      currentOrders = currentOrders.filter(order => order.count > 0);
    }
    sessionStorage.setItem('orders', JSON.stringify(currentOrders));

    this.orderItemsCountChanged.next(this.getOrderItemsCount());
  }

  deleteItem(id: number) {
    let currentOrders = JSON.parse(sessionStorage.getItem('orders')) || [];
    currentOrders = currentOrders.filter(order => order.id !== id);
    sessionStorage.setItem('orders', JSON.stringify(currentOrders));
    this.orderItemsCountChanged.next(this.getOrderItemsCount());
  }

  getOrderItems() {
    return this.http.post('/api/menu/group', {
      menuItems: JSON.parse(sessionStorage.getItem('orders')) || []
    });
  }

  getOrderItemsCount() {
    let allOrders = 0;
    const currentOrders = JSON.parse(sessionStorage.getItem('orders')) || [];

    if (currentOrders.length > 0) {
      currentOrders.forEach(order => {
        allOrders += order.count;
      });
    }
    return allOrders;
  }

  resetOrdersCount(){
    sessionStorage.setItem('orders', JSON.stringify([]));
    this.orderItemsCountChanged.next(this.getOrderItemsCount());    
  }

  setCurrentAddress(id) {
    this.currentAddressId = id;
  }

  createOrder(orderData) {
    return this.http.post("/api/order", orderData,this.setHeader());
  }
}
