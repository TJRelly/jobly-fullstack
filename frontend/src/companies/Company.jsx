import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import JobCardList from "../jobs/JobCardList";

/** Company Detail page.
 *
 * Renders information about company, along with the jobs at that company.
 *
 * Routed at /companies/:handle
 *
 * Routes -> CompanyDetail -> JobCardList
 */

function Company() {
    const { handle } = useParams();
    console.debug("CompanyDetail", "handle=", handle);

    const [company, setCompany] = useState(null);

    useEffect(
        function getCompanyAndJobsForUser() {
            async function getCompany() {
                setCompany(await JoblyApi.getCompany(handle));
            }

            getCompany();
        },
        [handle]
    );

    if (!company) return <LoadingSpinner />;

    return (
        <div className="CompanyDetail flex flex-col items-center min-h-screen pt-10">
            <div className="block max-w-lg p-6 bg-white">
                <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {company.name}
                </h6>
                <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
                    <small>{company.description}</small>
                </p>
                <JobCardList jobs={company.jobs} />
            </div>
        </div>
    );
}

export default Company;
