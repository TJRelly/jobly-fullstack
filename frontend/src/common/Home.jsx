import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="Home flex flex-col min-h-screen justify-center items-center bg-blue-400">
            <div className="text-5xl text-white font-bold">
                Welcome to Jobly
            </div>
            <div className="Home-auth flex text-2xl gap-4 p-4">
                <Link to={"/login"} className="text-white">
                    Login
                </Link>
                <Link to={"/signup"} className="text-white">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;
