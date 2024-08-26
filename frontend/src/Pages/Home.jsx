import React, { useEffect } from 'react'
import Banner from '../component/Banner'
import { useState } from 'react'
import Card from '../component/Card'
import Jobs from './Jobs'
import SideBar from '../sideBar/SideBar'
import NewsLetter from '../component/NewsLetter'


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //paginations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
 

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/all-jobs")
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            setJobs(data);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}, []);
console.log(jobs);

    // Handle input change
    const [query, setQuery] = useState("");
    const handleInputChange = (event) => {
        setQuery(event.target.value);
        // console.log(event.target.value);
    }

    // filtering jobs by title 
    const filteredItems = jobs.filter((job) => job.jobTitle
    .toLowerCase().indexOf(query.toLowerCase()) !== -1);
    // console.log(filteredItems);

    // --- radio based filtering ---
    const handleChange = (event) => {
      setSelectedCategory(event.target.value);
    }

    // ---- button based filtering ----
    const handleClick = (event) => {
      setSelectedCategory(event.target.value);
    }

    // calculating the index range 
    const calculatePageRange = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return {startIndex, endIndex}; 
    }

    // function for the next page
    const nextPage = () => {
      if(currentPage < Math.ceil(filteredItems.length / itemsPerPage)){
        setCurrentPage(currentPage + 1);
      }
    }

    // function for the previous page
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }

   const filteredData = (jobs, selected, query) => {
  let filteredJobs = jobs;

  // Filtering based on query (job title)
  if (query) {
    filteredJobs = filteredItems;  // Filtered items based on job title
  }

  // Filtering based on selected category (salary type, location, etc.)
  if (selected){
    filteredJobs = filteredJobs.filter(
      ({
        jobLocation,
        maxPrice,
        experienceLevel,
        salaryType,
        employmentType,
        postingDate,
    }) => 
      jobLocation.toLowerCase() === selected.toLowerCase() ||
      parseInt(maxPrice) <= parseInt(selected) ||
      postingDate >= selected ||
      salaryType.toLowerCase() === selected.toLowerCase() ||
      employmentType.toLowerCase() === selected.toLowerCase() ||
      experienceLevel.toLowerCase() === selected.toLowerCase()
  );
  console.log(filteredJobs);
  }



  // Paginate the data
  const { startIndex, endIndex } = calculatePageRange();
  filteredJobs = filteredJobs.slice(startIndex, endIndex);

  return filteredJobs.map((data, i) => <Card key={i} data={data} />);
};


  const result = filteredData(jobs, selectedCategory, query);

  return (
    <div>
      <Banner query={query} handleInputChange={handleInputChange}/>

      {/* main content */}
      <div className='bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12'>
        {/* left side */}
        <div className='bg-white p-4 rounded'>
           <SideBar handleChange={handleChange} handleClick={handleClick} />
        </div>
         
        {/* job card */}
        <div className='col-span-2 bg-white p-4 rounded-sm'>
          {
           isLoading ? (<p className='font-medium'>Loading....</p>) : result.length > 0 ?
           (<Jobs result={result}/>) : <>
           <h3 className='text-lg font-bold mb-2'>{result.length} Jobs</h3>
           <p>No data found</p>
           </>
          }

          {/*using the pagination */}
         {
              result.length > 0 && (
              <div className='flex justify-center mt-4 space-x-8'>
                <button className='hover:underline' disabled={currentPage === 1} 
                onClick={prevPage}> Previous</button>

                <span className='mx-2'>
                  Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)} 
                  </span>
                <button onClick={nextPage} 
                disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)} 
                className='hover:underline'>
                  Next</button>

              </div>
            )
          }


        </div>

        {/*right side */}
        <div className='bg-white p-4 rounded'><NewsLetter/></div>
        
      </div>
    </div>
    )
}

export default Home