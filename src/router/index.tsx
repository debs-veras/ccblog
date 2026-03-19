import React, { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ComplementaryActivities from "../pages/ComplementaryActivities";
import NewsPage from "../pages/NewsPage";
import AboutDepartment from "../pages/AboutDepartment";
import { ProtectedRoute, RoleProtectedRoute } from "./ProtectedRoute";
import DisciplineForm from "../pages/Discipline/form";
import MatrizCurricular from "../pages/CurricularMatrix";
import NewsDetail from "../pages/NewsDetail";

const Login = lazy(() => import("../pages/Login"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const SiteLayout = lazy(() => import("../layouts/SiteLayout"));
const PostForm = lazy(() => import("../pages/posts/form"));
const MyPosts = lazy(() => import("../pages/posts/listing"));
const PostAllListing = lazy(() => import("../pages/posts/allListing"));
const Categories = lazy(() => import("../pages/categories/listing"));
const CategoryForm = lazy(() => import("../pages/categories/form"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const UserForm = lazy(() => import("../pages/users/form"));
const UserListing = lazy(() => import("../pages/users/listing"));

function Router(): React.JSX.Element {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SiteLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "atividades-complementares",
          element: <ComplementaryActivities />,
        },
        {
          path: "noticias",
          element: <NewsPage />,
        },
        {
          path: "noticias/:slug",
          element: <NewsDetail />,
        },
        {
          path: "sobre-curso",
          element: <AboutDepartment />,
        },
        {
          path: "matriz-curricular",
          element: <MatrizCurricular />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "users",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <UserListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "user/form/:id?",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <UserForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "disciplina",
          element: <DisciplineForm />,
        },
        {
          path: "categorias",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Categories />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "categoria/form",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <CategoryForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "categoria/form/:id?",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <CategoryForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "post/form/:id?",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER", "STUDENT"]}>
              <PostForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "meus-posts",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER", "STUDENT"]}>
              <MyPosts />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "posts",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <PostAllListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "configuracoes",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER", "STUDENT"]}>
              <ChangePassword />
            </RoleProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
