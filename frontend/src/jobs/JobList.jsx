import { useState, useEffect } from "react";
import Search from "../common/SearchForm";
import JoblyApi from "../api/api";
import JobCard from "./JobCard";
import LoadingSpinner from "../common/LoadingSpinner";

const JobList = () => {
    console.debug("JobList");

    const [jobs, setJobs] = useState(null);

    useEffect(function getAllJobsOnMount() {
        console.debug("JobList useEffect getAllJobsOnMount");
        search();
    }, []);

    async function search(title) {
        let jobs = await JoblyApi.getJobs(title);
        setJobs(jobs);
    }

    if (!jobs) return <LoadingSpinner />;

    return (
        <div className="max-w-md mx-auto">
            <Search searchFor={search} />
            {jobs.length ? (
                <div className="JobList-list">
                    {jobs.map((j) => (
                        <JobCard
                            key={j.handle}
                            id={j.id}
                            title={j.title}
                            salary={j.salary}
                            equity={j.equity}
                            companyName={j.companyName}
                        />
                    ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
        </div>
    );
};

export default JobList;
