import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useStorage } from "../hooks/storage";
import { validateToken } from "../services/auth.service";
import Loading from "../components/UI/Loading";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const storage = useStorage();
  const token = storage.getSession();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function validate() {
      if (!token || token === "undefined" || token === "null") {
        setIsValid(false);
        return;
      }

      const response = await validateToken();
      if (response.success && response.data) setIsValid(response.data.valid);
      else {
        storage.removeSession();
        setIsValid(false);
      }
    }

    validate();
  }, [token]);

  if (isValid === null) return <Loading />;
  if (!isValid) return <Navigate to="/login" replace />;
  return children;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const storage = useStorage();
  const user = storage.getUser();
  const token = storage.getSession();

  if (!token) return <Navigate to="/login" replace />;
  if (!user || !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;
  return <>{children}</>;
}
