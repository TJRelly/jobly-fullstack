import SearchForm from "../common/SearchForm";
import { useEffect, useState } from "react";
import JoblyApi from "../api/api";
import CompanyCard from "./CompanyCard";
import LoadingSpinner from "../common/LoadingSpinner";

const CompanyList = () => {
    const [companies, setCompanies] = useState(null);

    useEffect(function getCompaniesOnMount() {
        search();
    }, []);

    /** Triggered by search form submit; reloads companies. */
    async function search(name) {
        let companies = await JoblyApi.getCompanies(name);
        setCompanies(companies);
    }

    if (!companies) return <LoadingSpinner />;

    return (
        <div className="max-w-md mx-auto">
            <SearchForm searchFor={search} />
            {companies.length ? (
                <div className="CompanyList-list">
                    {companies.map((c) => (
                        <CompanyCard
                            key={c.handle}
                            handle={c.handle}
                            name={c.name}
                            description={c.description}
                            logoUrl={c.logoUrl}
                        />
                    ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
        </div>
    );
};

export default CompanyList;
