import { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet as TanstackOutlet,
  RouterProvider as TanstackRouterProvider,
  createMemoryHistory
} from "@tanstack/react-router";

import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const rootRoute = createRootRoute({
  component: () => {
    return (
      <div>
        tanstack <TanstackOutlet />
      </div>
    );
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: function Home() {
    return (
      <div>
        <h2>Home</h2>
        <p>This is the home page.</p>
      </div>
    );
  },
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return (
      <div>
        <h2>About</h2>
        <p>This is the about page.</p>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);

const router = createRouter({
  history: createMemoryHistory({ initialEntries: ['/'] }),
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof rootRoute;
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <TanstackRouterProvider router={router} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
