import React from 'react'
import InputField from '../component/InputField';


const JobPostingData = ({handleChange}) => {
    const now = new Date();
    // console.log(now);
    const twentyFourHours = new Date( now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date( now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date( now - 30 * 24 * 60 * 60 * 1000);
    // console.log(twentyFourHours);
    // convert date to string 
    const twentyFourHoursDate =  twentyFourHours.toISOString().slice(0, 10);
    const sevenDaysAgoDate =  sevenDaysAgo.toISOString().slice(0, 10);
    const thirtyDaysAgoDate =  thirtyDaysAgo.toISOString().slice(0, 10);
    
  return (
     <div>
      <h4 className='text-lg font-medium mb-2'>Date of Posting</h4>

      <div>
        <label className='sidebar-label-container'>
          <input
            type='radio'
            name='location3'
            id='all'
            value=''
            onChange={handleChange}
          />
          <span className='checkmark'></span>
          All Time
        </label>
        <InputField
          handleChange={handleChange}
          value={twentyFourHoursDate}
          title='Last 24 Hours'
          name='location3'
        />
        <InputField
          handleChange={handleChange}
          value={sevenDaysAgoDate}
          title='Last 7 days'
          name='location3'
        />
        <InputField
          handleChange={handleChange}
          value={thirtyDaysAgoDate}
          title='Last Month'
          name='location3'
        />
      </div>
    </div>
  )
}

export default JobPostingData