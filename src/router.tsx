import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Main from "./pages/Main/Main";
import Recorder from "./pages/Main/Recorder/Recorder";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";

// Subpages

export default function MyRouter() {
    return (
        <Routes>
            <Route path="investment">
                <Route path="" element={<Main />}>
                    <Route path="" element={<Navigate to="recorder" />}></Route>
                    <Route path="recorder" element={<Recorder />}></Route>
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
