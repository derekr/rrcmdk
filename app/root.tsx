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
  createMemoryHistory,
  Link as TanstackLink,
} from "@tanstack/react-router";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
        <CommandDialog open={true}>
          <TanstackOutlet />
        </CommandDialog>
      </>
    );
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => cmdRouter.navigate({ to: '/home' })}>
              Home
            </CommandItem>
            <CommandItem onSelect={() => cmdRouter.navigate({ to: '/about' })}>
              About
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </>
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
        <TanstackLink to="/">Back</TanstackLink>
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
        <TanstackLink to="/">Back</TanstackLink>
        <p>This is the about page.</p>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([indexRoute, homeRoute, aboutRoute]);

const cmdRouter = createRouter({
  history: createMemoryHistory({ initialEntries: ["/"] }),
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
        <TanstackRouterProvider router={cmdRouter} />
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
