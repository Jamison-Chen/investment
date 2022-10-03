import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Main from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";

// Subpages
import Overview from "./pages/Main/Overview/Overview";
import Individual from "./pages/Main/Individual/Individual";
import Account from "./pages/Main/Account/Account";

export default function MyRouter() {
    return (
        <Routes>
            <Route path="investment">
                <Route path="" element={<Main />}>
                    <Route path="" element={<Navigate to="overview" />}></Route>
                    <Route path="overview" element={<Overview />}></Route>
                    <Route path="individual" element={<Individual />}></Route>
                    <Route path="account" element={<Account />} />
                </Route>
                <Route path="login" element={<Login />} />
                {/* Sign up */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
