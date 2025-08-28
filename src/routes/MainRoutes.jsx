import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const MainLayout = lazy(() => import("../components/MainLayout"));
const ProductsManagement = lazy(() => import("../pages/ProductsManagement"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: (
                    <Suspense>
                        <ProductsManagement />
                    </Suspense>
                )
            },
        ]
    },
])

export default router