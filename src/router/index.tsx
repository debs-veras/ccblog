import React, { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SiteLoader from "../components/SiteLoader";
import { ProtectedRoute, RoleProtectedRoute } from "./ProtectedRoute";

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const SiteLayout = lazy(() => import("../layouts/SiteLayout"));

// Sistema
const DisciplineForm = lazy(() => import("../pages/Discipline/form"));
const DisciplineListing = lazy(() => import("../pages/Discipline/listing"));
const PostForm = lazy(() => import("../pages/posts/form"));
const MyPosts = lazy(() => import("../pages/posts/listing"));
const PostAllListing = lazy(() => import("../pages/posts/allListing"));
const Categories = lazy(() => import("../pages/categories/listing"));
const CategoryForm = lazy(() => import("../pages/categories/form"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const UserForm = lazy(() => import("../pages/users/form"));
const UserListing = lazy(() => import("../pages/users/listing"));
const EnrollmentPage = lazy(() => import("../pages/Enrollment"));
const DashboardStudent = lazy(() => import("../pages/DashboardStudent"));
const DashboardTeacher = lazy(() => import("../pages/DashboardTeacher"));
const Login = lazy(() => import("../pages/Login"));

// Site
const Home = lazy(() => import("../pages/Home"));
const ComplementaryActivities = lazy(
  () => import("../pages/ComplementaryActivities"),
);
const NewsPage = lazy(() => import("../pages/NewsPage"));
const AboutDepartment = lazy(() => import("../pages/AboutDepartment"));
const MatrizCurricular = lazy(() => import("../pages/CurricularMatrix"));
const NewsDetail = lazy(() => import("../pages/NewsDetail"));
const Atletica = lazy(() => import("../pages/Atletica"));
const NotFound = lazy(() => import("../pages/NotFound"));

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
          path: "atletica",
          element: <Atletica />,
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
      path: "*",
      element: <NotFound />,
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
          path: "disciplinas",
          element: <DisciplineListing />,
        },
        {
          path: "disciplina/form/:id?",
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
            <RoleProtectedRoute allowedRoles={["TEACHER", "STUDENT"]}>
              <ChangePassword />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "matricula",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
              <EnrollmentPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "dashboard/aluno",
          element: (
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <DashboardStudent />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "dashboard/professor",
          element: (
            <RoleProtectedRoute allowedRoles={["TEACHER"]}>
              <DashboardTeacher />
            </RoleProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <Suspense fallback={<SiteLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Router;
