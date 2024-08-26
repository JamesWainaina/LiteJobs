import React from 'react'
import InputField from '../component/InputField'

const WorkExperience = ({handleChange}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Work Experience</h4>

      <div>
        <label className='sidebar-label-container'>
          <input
            type='radio'
            name='location'
            id='all'
            value=''
            onChange={handleChange}
          />
          <span className='checkmark'></span>
          Any experience
        </label>
        <InputField
          handleChange={handleChange}
          value='No Experience'
          title='No Experience'
          name='location'
        />
        <InputField
          handleChange={handleChange}
          value='Internship'
          title='Internship'
          name='location'
        />
        <InputField
          handleChange={handleChange}
          value='Junior Level'
          title='Junior Level'
          name='location'
        />
        <InputField
          handleChange={handleChange}
          value='Mid Level'
          title='Mid Level'
          name='location'
        />
        <InputField
          handleChange={handleChange}
          value='Senior Level'
          title='Senior Level'
          name='location'
        />
        
      </div>
    </div>
  )
}

export default WorkExperience