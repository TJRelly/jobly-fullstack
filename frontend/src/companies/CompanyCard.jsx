/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./CompanyCard.css";

const CompanyCard = ({ handle, name, description, logoUrl }) => {
    return (
        <Link className="CompanyCard card" to={`/companies/${handle}`}>
            <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {name}
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt={name}
                            className="float-right ml-5"
                        />
                    )}
                </h6>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    <small>{description}</small>
                </p>
            </div>
        </Link>
    );
};

export default CompanyCard;
