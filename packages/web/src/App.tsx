import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { requireAuth } from "./lib/require-auth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
    loader: requireAuth,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
