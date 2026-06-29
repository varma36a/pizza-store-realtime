# Pizza Store — Real-Time Angular Interview Prep

A full-featured **Angular 19** demo app themed around a real-time pizza store. Built to cover the topics most commonly asked in senior Angular interviews.

## Quick Start

```bash
cd InterviewPrep_2026/pizza-store-realtime
npm install
npm start
```

Open **http://localhost:4200**

### Demo Accounts

| Role     | Email               | Password     |
|----------|---------------------|--------------|
| Customer | customer@pizza.com  | password123  |
| Admin    | admin@pizza.com     | password123  |

## User Flow

1. Browse the **Menu** — search, filter by category, quick-add to cart
2. **Customize** a pizza (size, toppings, quantity) with reactive forms
3. **Checkout** (requires login) with address validation
4. **Track your order live** — status updates every 4 seconds (simulated WebSocket)
5. **Admin dashboard** — kitchen view of all active orders in real time

## Angular Features Covered

| Topic | Where in Code |
|-------|---------------|
| **Standalone components** | All components — no NgModules |
| **Signals & computed** | `src/app/store/cart.store.ts`, `order.store.ts` |
| **New control flow** | `@if`, `@for` in all templates |
| **Lazy loading** | `src/app/app.routes.ts` — `loadComponent` |
| **Route guards** | `authGuard`, `adminGuard`, `guestGuard` |
| **Route resolvers** | `menuResolver`, `pizzaDetailResolver` |
| **Reactive forms** | Checkout, Login, Pizza Detail |
| **Validators** | Required, email, pattern (ZIP, phone) |
| **HttpClient interceptors** | Auth, loading, error |
| **RxJS operators** | `debounceTime`, `switchMap`, `delay`, `catchError` |
| **toSignal** | Pizza detail live price from `valueChanges` |
| **OnPush change detection** | All feature components |
| **Custom pipes** | `pizzaCurrency`, `timeAgo` |
| **Custom directives** | `appHighlight`, `appClickOutside` |
| **DI with inject()** | Services and components |
| **Real-time updates** | `RealtimeService` — Subject + interval (WebSocket pattern) |
| **Angular Material** | Toolbar, cards, tables, forms, snackbar |
| **Unit tests** | `cart.store.spec.ts`, `auth.service.spec.ts` |

## Project Structure

```
src/app/
├── core/           # Models, services, guards, interceptors, resolvers
├── store/          # Signal-based state (CartStore, OrderStore)
├── shared/         # Reusable pipes, directives, components
├── features/       # Lazy-loaded pages (menu, cart, checkout, admin…)
├── app.routes.ts
└── app.config.ts
```

## Real-Time Architecture

The app simulates a WebSocket connection for order tracking:

```
Order placed → RealtimeService.connect()
             → interval(4s) advances order status
             → Subject emits OrderStatusEvent
             → OrderStore updates → UI refreshes live
```

In production you'd swap `RealtimeService` for `WebSocketSubject`, Server-Sent Events, or SignalR.

## Interview Talking Points

- **Why signals over BehaviorSubject for cart state?** Fine-grained reactivity, simpler mental model, integrates with computed().
- **Why OnPush everywhere?** Fewer change detection cycles; works well with signals and immutable updates.
- **Guard vs Resolver?** Guards allow/deny navigation; resolvers pre-fetch data before route activates.
- **Functional interceptors vs class-based?** Angular 15+ functional interceptors are tree-shakable and use `inject()`.
- **Lazy loading benefits?** Smaller initial bundle, faster first paint.

## Scripts

```bash
npm start          # Dev server
npm run build      # Production build
npm test           # Unit tests
```

## Tech Stack

- Angular 19 (standalone, signals, new control flow)
- Angular Material 19
- RxJS 7
- TypeScript 5.7
- SCSS
