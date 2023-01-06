import {
    Routes,
    Route,
    Navigate,
    Location,
    NavigateFunction,
    Params,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

// layer one
import Main from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// layer two
import Account from "./pages/Main/Account/Account";
import Overview from "./pages/Main/Overview/Overview";
import Records from "./pages/Main/Records/Records";
import StockList from "./pages/Main/StockList/StockList";
import Details from "./pages/Main/Details/Details";
import Plans from "./pages/Main/Plans/Plans";
import ExternalApps from "./pages/Main/ExternalApps/ExternalApps";

// layer three
import Avatar from "./pages/Main/Account/Avatar/Avatar";
import Username from "./pages/Main/Account/Username/Username";
import Email from "./pages/Main/Account/Email/Email";
import Password from "./pages/Main/Account/Password/Password";
import DeleteAccount from "./pages/Main/Account/DeleteAccount/DeleteAccount";

export default function MyRouter() {
    return (
        <Routes>
            <Route path="investment">
                <Route path="" element={<Main />}>
                    <Route path="" element={<Navigate to="overview" />}></Route>
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
                    <Route
                        path="account/delete-account"
                        element={<DeleteAccount />}
                    ></Route>
                    <Route path="overview" element={<Overview />}></Route>
                    <Route path="records" element={<Records />}></Route>
                    <Route path="stock-list" element={<StockList />}></Route>
                    <Route path="stock-list/:sid" element={<Details />}></Route>
                    <Route path="plans" element={<Plans />}></Route>
                    <Route
                        path="external-apps"
                        element={<ExternalApps />}
                    ></Route>
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export interface RouterInterface {
    router: {
        location: Location;
        navigate: NavigateFunction;
        params: Params;
        search_params: URLSearchParams;
        set_search_params: ReturnType<typeof useSearchParams>[1];
    };
}

export function withRouter(Component: any) {
    return (props: any = {}) => {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        let [search_params, set_search_params] = useSearchParams();
        return (
            <Component
                {...props}
                router={{
                    location,
                    navigate,
                    params,
                    search_params,
                    set_search_params,
                }}
            />
        );
    };
}
