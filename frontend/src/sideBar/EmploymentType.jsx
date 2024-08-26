import React from 'react'
import InputField from '../component/InputField'

const EmploymentType = ({handleChange}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Employment Type</h4>

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
          Any
        </label>
        
        <InputField
          handleChange={handleChange}
          value='Full-time'
          title='Full-time'
          name='location'
        />
        <InputField
          handleChange={handleChange}
          value='Part-time'
          title='Part-time'
          name='location'
        />
         <InputField
          handleChange={handleChange}
          value='Contract'
          title='Contract'
          name='location'
          />
          <InputField
          handleChange={handleChange}
          value='On-site'
          title='On-site'
          name='location'
          />
           <InputField
          handleChange={handleChange}
          value='Hybrid'
          title='Hybrid'
          name='location'
          />

        <InputField
          handleChange={handleChange}
          value='Remote'
          title='Remote'
          name='location'
        />
      </div>
    </div>
  )
}

export default EmploymentType