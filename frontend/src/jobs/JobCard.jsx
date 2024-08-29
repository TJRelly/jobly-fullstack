/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import "./JobCard.css";
import UserContext from "../auth/UserContext";

/** Show limited information about a job.
 *
 * Is rendered by JobCardList to show a "card" for each job.
 *
 * Receives apply func prop from parent, which is called on apply.
 *
 * JobCardList -> JobCard
 */

function JobCard({ id, title, salary, equity, companyName }) {
    console.debug("JobCard");
    const { hasAppliedToJob, applyToJob } = useContext(UserContext);
    const [applied, setApplied] = useState();

    useEffect(
        function updateAppliedStatus() {
            console.debug("JobCard useEffect updateAppliedStatus", "id=", id);

            setApplied(hasAppliedToJob(id));
        },
        [id, hasAppliedToJob]
    );

    /** Apply for a job */
    async function handleApply(evt) {
        evt.preventDefault();
        if (hasAppliedToJob(id)) return;
        applyToJob(id);
        setApplied(true);
    }

    return (
        <div className="JobCard card px-0 py-2">
            <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h6>
                <p>{companyName}</p>
                <button
                    type="button"
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 float-right"
                    onClick={handleApply}
                    disabled={applied}
                >
                    {applied ? "Applied" : "Apply"}
                </button>
                {salary && (
                    <div>
                        <small>Salary: ${formatSalary(salary)}</small>
                    </div>
                )}

                {equity !== undefined && (
                    <div>
                        <small>Equity: {equity ? equity : "none"}</small>
                    </div>
                )}
            </div>
        </div>
    );
}

/** Render integer salary like '$1,250,343' */

function formatSalary(salary) {
    const digitsRev = [];
    const salaryStr = salary.toString();

    for (let i = salaryStr.length - 1; i >= 0; i--) {
        digitsRev.push(salaryStr[i]);
        if (i > 0 && i % 3 === 0) digitsRev.push(",");
    }

    return digitsRev.reverse().join("");
}

export default JobCard;
