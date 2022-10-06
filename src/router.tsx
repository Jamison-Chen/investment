import { Routes, Route, Navigate } from "react-router-dom";

// layer one
import Main from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// layer two
import Overview from "./pages/Main/Overview/Overview";
import Individual from "./pages/Main/Individual/Individual";
import Account from "./pages/Main/Account/Account";
import Apps from "./pages/Main/Apps/Apps";

// layer three
import Avatar from "./pages/Main/Account/Avatar/Avatar";
import Username from "./pages/Main/Account/Username/Username";
import Email from "./pages/Main/Account/Email/Email";
import Password from "./pages/Main/Account/Password/Password";

export default function MyRouter() {
    return (
        <Routes>
            <Route path="investment">
                <Route path="" element={<Main />}>
                    <Route path="" element={<Navigate to="overview" />}></Route>
                    <Route path="overview" element={<Overview />}></Route>
                    <Route path="individual" element={<Individual />}></Route>
                    <Route path="apps" element={<Apps />}></Route>
                    <Route path="account" element={<Account />}></Route>
                    <Route path="account/avatar" element={<Avatar />}></Route>
                    <Route
                        path="account/username"
                        element={<Username />}
                    ></Route>
                    <Route path="account/email" element={<Email />}></Route>
                    <Route
                        path="account/password"
                        element={<Password />}
                    ></Route>
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
