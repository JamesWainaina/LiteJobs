import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/myJobs/test@gmail.com`)
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setFilteredJobs(data);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchText === "") {
            setFilteredJobs(jobs);
        } else {
            const filtered = jobs.filter(job =>
                job.jobTitle.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredJobs(filtered);
            setCurrentPage(1); // Reset to the first page when searching
        }
    }, [searchText, jobs]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = () => {
        // Trigger search filter by changing searchText state
        setSearchText(searchText);
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:3000/job/${id}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then(data => {
            if (data.acknowledged === true) {
                alert("Job deleted successfully!!!");
                // Remove the deleted job from state
                setJobs(jobs.filter(job => job._id !== id));
                setFilteredJobs(filteredJobs.filter(job => job._id !== id));
            }
        });
    };

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <div className='my-jobs-container'>
                <h1 className='text-center p-4'>ALL MY JOBS</h1>
                <div className='search-box p-2 text-center mb-2'>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="py-2 pl-3 border focus:outline-none lg:w-6/12 w-full mb-4"
                        placeholder="Search for jobs..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button onClick={handleSearch} className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4 ml-2'>
                        Search
                    </button>
                </div>
            </div>

            <section className="py-1 bg-blueGray-50">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                    <h3 className="font-semibold text-base text-blueGray-700">ALL Jobs</h3>
                                </div>
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                    <Link to="/post-job">
                                        <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                            Post a New Job
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            NO.
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Job Title
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            COMPANY NAME
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            SALARY
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            EDIT
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            DELETE
                                        </th>
                                    </tr>
                                </thead>
                                {
                                    isLoading ? (
                                        <div className='flex items-center justify-center h-20'>
                                            <p>Loading....</p>
                                        </div>
                                    ) : (
                                        <tbody>
                                            {
                                                currentJobs.map((job, index) => (
                                                    <tr key={index}>
                                                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                                                            {index + 1}
                                                        </th>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            {job.jobTitle}
                                                        </td>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            {job.companyName}
                                                        </td>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            ${job.minPrice} - ${job.maxPrice}
                                                        </td>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            <Link to={`/edit-job/${job?._id}`}> Edit </Link>
                                                        </td>
                                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                            <i className="fas fa-arrow-up text-emerald-500 mr-4"></i>
                                                            <button className='bg-red-700 py-2 px-6 text-white rounded-sm' onClick={() => handleDelete(job._id)}>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    )
                                }
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className='flex justify-center text-black space-x-8 mb-8'>
                    {
                        currentPage > 1 && (
                            <button onClick={prevPage} className='hover:underline'>Previous</button>
                        )
                    }
                    {
                        currentPage < totalPages && (
                            <button onClick={nextPage} className='hover:underline'>Next</button>
                        )
                    }
                </div>
            </section>
        </div>
    );
};

export default MyJobs
