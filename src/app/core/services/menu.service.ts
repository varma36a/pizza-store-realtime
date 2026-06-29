import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { MOCK_PIZZAS } from '../data/mock-pizzas';
import { Pizza, PizzaCategory } from '../models/pizza.model';

export interface MenuFilters {
  category?: PizzaCategory | 'all';
  search?: string;
  vegetarianOnly?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  getAll(): Observable<Pizza[]> {
    return of(MOCK_PIZZAS).pipe(delay(400));
  }

  getById(id: string): Observable<Pizza | undefined> {
    return of(MOCK_PIZZAS.find((p) => p.id === id)).pipe(delay(300));
  }

  search(filters: MenuFilters): Observable<Pizza[]> {
    return this.getAll().pipe(
      map((pizzas) => {
        let result = [...pizzas];

        if (filters.category && filters.category !== 'all') {
          result = result.filter((p) => p.category === filters.category);
        }

        if (filters.vegetarianOnly) {
          result = result.filter((p) => p.isVegetarian);
        }

        if (filters.search?.trim()) {
          const term = filters.search.toLowerCase();
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(term) ||
              p.description.toLowerCase().includes(term) ||
              p.toppings.some((t) => t.toLowerCase().includes(term))
          );
        }

        return result;
      })
    );
  }
}
