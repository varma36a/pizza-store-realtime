import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Pizza } from '../models/pizza.model';
import { MenuService } from '../services/menu.service';

export const menuResolver: ResolveFn<Pizza[]> = () => {
  return inject(MenuService).getAll();
};

export const pizzaDetailResolver: ResolveFn<Pizza | undefined> = (route) => {
  const id = route.paramMap.get('id')!;
  return inject(MenuService).getById(id);
};
