import React, {useState} from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import CreatableSelect from 'react-select/creatable';

const UpdateJob = () => {
    const {id} = useParams();
    // console.log(id);
    const {_id, jobTitle, companyName, companyLogo, minPrice, maxPrice, salaryType, jobLocation, postingDate,
        experienceLevel,employmentType, description, postedBy, skills} = useLoaderData()

    const [selectedOption, setSelectedOption] = useState(null); 
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


  // http://localhost:3000/post-job
  const onSubmit = (data) => { 
    // Convert selected options to an array of skill values
    data.skills = selectedOption;
    // console.log(data); 
    fetch(`http://localhost:3000/update-job/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      console.log(result);
      if (result.acknowledged === true) {
        alert("Job updated successfully");
      }
      reset();
    });
  }


  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
    { value: "C#", label: "C#" },
    { value: "PHP", label: "PHP" },
    { value: "Ruby", label: "Ruby" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Swift", label: "Swift" }
  ];

  return (
     <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
      {/* form */}
      <div className='bg-[#FAFAFA] py-10 px-4 lg:px-16'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* 1st row */}
          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Job Title</label>
              <input 
              type="text"
                defaultValue={jobTitle}
               {...register("jobTitle")} 
               className='create-job-input' />
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>
                Company name
            </label>
              <input type="text"
               defaultValue={companyName}
               {...register("companyName")} 
               className='create-job-input' />
            </div>
          </div>

          {/* 2nd row */}
          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Minimum Salary</label>
              <input type="text" 
              defaultValue={minPrice}
               {...register("minPrice")} className='create-job-input' />
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Maximum Salary</label>
              <input type="text" 
              defaultValue={maxPrice}
               {...register("maxPrice")} 
               className='create-job-input' />
            </div>
          </div>

          {/* 3rd row */}
          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Salary Type</label>
               <select {...register("salaryType")} className='create-job-input'>
                <option value={salaryType}>{salaryType}</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Job Location</label>
              <input type="text" defaultValue={jobLocation}
               {...register("jobLocation")} className='create-job-input' /> {/* Changed name to 'jobLocation' */}
            </div>
          </div>

          {/* 4th row */}
          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Job Posting Date</label>
              <input type="date"
               defaultValue={postingDate}
               {...register("postingDate")} className='create-job-input' />
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Experience Level</label>
               <select {...register("experienceLevel")} 
               className='create-job-input'>
                <option value={experienceLevel}>{experienceLevel}</option>
                <option value="Any experience">Any experience</option>
                <option value="NoExperience">No Experience</option>
                <option value="Internship">Internship</option>
                <option value="Junior level">Junior Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
          </div>

          {/* 5th row */}
          <div>
            <label className='block mb-2 text-lg'> Required Skill sets:</label>
            <CreatableSelect
              className='create-job-input py-4'
              defaultValue={skills}
              onChange={setSelectedOption} // Update state on selection change
              options={options}
              isMulti
            />
          </div>

        {/* 6th row */}
         <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Company Logo</label>
              <input type="url" 
             defaultValue={companyLogo}
                {...register("companyLogo")} 
                className='create-job-input' />
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'> Employment Type</label>
               <select {...register("employmentType")} className='create-job-input'>
                <option value={employmentType}>{employmentType}</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

        {/* 7th row */}
        <div className='w-full'>
            <label className='block mb-2 text-lg'> Job Description</label>
            <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700'
            rows={6}
           defaultValue={description}
            {...register("description")} />
        </div>

        {/* last  row */}
        <div className='w-full'>
            <label className='block mb-2 text-lg'>Job Posted By</label>
             <input type="email" 
             defaultValue={postedBy}
               {...register("postedBy")}
                className='create-job-input' />
        </div>
          <input 
            type="submit" 
            className='block mt-12 bg-blue text-white font-semibold px-8 py-2 
            rounded-sm cursor-pointer'
          />
        </form>
      </div>
    </div>
  )
}

export default UpdateJob