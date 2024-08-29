import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import JoblyApi from "./api/api";
import { jwtDecode } from "jwt-decode";
// Components
import Navigation from "./common/Nav";
import Home from "./common/Home";
import CompanyList from "./companies/CompanyList";
import Company from "./companies/Company";
import JobList from "./jobs/JobList";
import LoginForm from "./auth/LoginForm";
import Register from "./auth/RegisterForm";
import ProfileForm from "./auth/ProfileForm";
import NotFound from "./common/NotFound";
import PrivateRoutes from "./common/PrivateRoute";
import UserContext from "./auth/UserContext";
import useLocalStorage from "./hooks/useLocalStorage";
import LoadingSpinner from "./common/LoadingSpinner";
// CSS
import "./App.css";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "jobly-token";

/** Jobly application.
 *
 * - infoLoaded: has user data been pulled from API?
 *   (this manages spinner for "loading...")
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */

function App() {
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [applicationIds, setApplicationIds] = useState(new Set([]));
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

    console.debug(
        "App",
        "infoLoaded=",
        infoLoaded,
        "currentUser=",
        currentUser,
        "token=",
        token
    );

    // Load user info from API. Until a user is logged in and they have a token,
    // this should not run. It only needs to re-run when a user logs out, so
    // the value of the token is a dependency for this effect.

    useEffect(
        function loadUserInfo() {
            console.debug("App useEffect loadUserInfo", "token=", token);

            async function getCurrentUser() {
                if (token) {
                    try {
                        let { username } = jwtDecode(token);
                        // put the token on the Api class so it can use it to call the API.
                        JoblyApi.token = token;
                        let currentUser = await JoblyApi.getCurrentUser(
                            username
                        );
                        setCurrentUser(currentUser);
                        setApplicationIds(new Set(currentUser.applications));
                    } catch (err) {
                        console.error("App loadUserInfo: problem loading", err);
                        setCurrentUser(null);
                    }
                }
                setInfoLoaded(true);
            }

            // set infoLoaded to false while async getCurrentUser runs; once the
            // data is fetched (or even if an error happens!), this will be set back
            // to false to control the spinner.
            setInfoLoaded(false);
            getCurrentUser();
        },
        [token]
    );

    /** Handles site-wide logout. */
    function logout(data) {
        setCurrentUser(null);
        setToken(null);
        console.log(data);
    }

    /** Handles site-wide signup.
     *
     * Automatically logs them in (set token) upon signup.
     *
     * Make sure you await this function and check its return value!
     */
    async function signup(signupData) {
        try {
            let token = await JoblyApi.signup(signupData);
            setToken(token);
            return { success: true };
        } catch (errors) {
            console.error("signup failed", errors);
            return { success: false, errors };
        }
    }

    /** Handles site-wide login.
     *
     * Make sure you await this function and check its return value!
     */
    async function login(loginData) {
        try {
            let token = await JoblyApi.login(loginData);
            setToken(token);
            return { success: true };
        } catch (errors) {
            console.error("login failed", errors);
            return { success: false, errors };
        }
    }

    /** Checks if a job has been applied for. */
    function hasAppliedToJob(id) {
        return applicationIds.has(id);
    }

    /** Apply to a job: make API call and update set of application IDs. */
    function applyToJob(id) {
        if (hasAppliedToJob(id)) return;
        JoblyApi.applyToJob(currentUser.username, id);
        setApplicationIds(new Set([...applicationIds, id]));
    }

    if (!infoLoaded) return <LoadingSpinner />;

    return (
        <div className="App">
            <BrowserRouter>
                <UserContext.Provider
                    value={{
                        currentUser,
                        setCurrentUser,
                        hasAppliedToJob,
                        applyToJob,
                    }}
                >
                    <Navigation logout={logout} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={<LoginForm login={login} />}
                        />
                        <Route
                            path="/signup"
                            element={<Register signup={signup} />}
                        />
                        <Route element={<PrivateRoutes />}>
                            <Route
                                path="/companies"
                                element={<CompanyList />}
                            />
                            <Route
                                path="/companies/:handle"
                                element={<Company />}
                            />
                            <Route path="/jobs" element={<JobList />} />
                            <Route path="/profile" element={<ProfileForm />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
