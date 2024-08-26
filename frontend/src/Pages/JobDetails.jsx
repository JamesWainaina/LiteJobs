import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import PageHeader from '../component/PageHeader';
import { app, auth, storage } from '../firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL  } from '../firebase/firebase.config';


Modal.setAppElement('#root');

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:3000/all-jobs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch job details');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
const onSubmit = async (formData) => {
  const user = auth.currentUser;

  if (user) {
    try {
      const token = await user.getIdToken();
      let cvUrl = '';

      const formDataObj = new FormData();

      // Append other fields
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('country', formData.country);
      formDataObj.append('coverLetter', formData.coverLetter);

      // Append file
      if (formData.cv[0]) {
        formDataObj.append('cv', formData.cv[0]);
      }

      const response = await fetch(`http://localhost:3000/apply/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json', // FormData sets this automatically
        },
        body: formDataObj,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${response.statusText}\nDetails: ${errorText}`);
      }

      Swal.fire('Success!', 'Your application has been submitted.', 'success');
    } catch (error) {
      console.error('Error submitting application:', error);
      Swal.fire('Error!', `There was an error submitting your application: ${error.message}`, 'error');
    }
  } else {
    console.error('User is not logged in');
  }
};


  if (loading) {
    return <div className='max-w-screen-2xl container mx-auto xl:p-24 px-4'>Loading...</div>;
  }

  if (error) {
    return <div className='max-w-screen-2xl container mx-auto xl:p-24 px-4'>Error: {error}</div>;
  }

  return (
    <div className='max-w-screen-2xl container mx-auto xl:p-24 px-4'>
      <PageHeader title={'Job Details'} path={'Job Overview'} />

      <div className='bg-gray-100 p-6 rounded-lg shadow-lg mb-8'>
        <h1 className='text-3xl font-bold mb-4'>{job?.jobTitle || 'Job Title Not Available'}</h1>
        <img className='w-32 h-32 mb-4' src={job?.companyLogo || 'default-logo.png'} alt={job?.companyName || 'Company Logo'} />
        <p className='text-xl text-gray-700 mb-4'>{job?.companyName || 'Company Name Not Available'}</p>
        <p className='text-lg text-gray-600 mb-4'>{job?.jobLocation || 'Location Not Available'}</p>
        <p className='text-lg text-gray-600 mb-4'>Salary: ${job?.minPrice} - ${job?.maxPrice} {job?.salaryType || ''}</p>
        <p className='text-lg text-gray-600 mb-4'>Employment Type: {job?.employmentType || 'Not Specified'}</p>
        <p className='text-lg text-gray-600 mb-4'>Experience Level: {job?.experienceLevel || 'Not Specified'}</p>
        <p className='text-lg text-gray-600 mb-4'>Posted on: {job?.postingDate || 'Not Specified'}</p>
        <p className='text-lg text-gray-600 mb-4'>Posted By: {job?.postedBy || 'Not Specified'}</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>Job Description</h2>
          <p className='text-gray-700'>{job?.description || 'No description available.'}</p>
        </div>

        <div>
          <h2 className='text-2xl font-semibold mb-4'>Required Skill Sets</h2>
          <ul className='list-disc list-inside text-gray-700'>
            {job?.skills?.map((skill, index) => (
              <li key={index} className='mb-2'>{skill.label}</li>
            )) || <p>No skills specified.</p>}
          </ul>
        </div>
      </div>

      <div className='text-center'>
        <button
          className='bg-blue hover:bg-blue-700 mb-4 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300'
          onClick={openModal}
        >
          Apply Now
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Apply for Job"
        className="modal w-full max-w-lg mx-auto my-20 bg-white rounded-lg p-6"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        style={{ content: { overflowY: 'auto', maxHeight: '90vh' } }}
      >
        <h2 className='text-2xl font-bold mb-4'>Apply for {job?.jobTitle}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-lg mb-2'>Name</label>
            <input
              type='text'
              {...register('name', { required: true })}
              className='w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500'
            />
            {errors.name && <p className='text-red-600'>Name is required</p>}
          </div>

          <div>
            <label className='block text-lg mb-2'>Email</label>
            <input
              type='email'
              {...register('email', { required: true })}
              className='w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500'
            />
            {errors.email && <p className='text-red-600'>Email is required</p>}
          </div>

          <div>
            <label className='block text-lg mb-2'>Phone Number</label>
            <input
              type='text'
              {...register('phone', { required: true })}
              className='w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500'
            />
            {errors.phone && <p className='text-red-600'>Phone number is required</p>}
          </div>

          <div>
            <label className='block text-lg mb-2'>Country</label>
            <input
              type='text'
              {...register('country', { required: true })}
              className='w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500'
            />
            {errors.country && <p className='text-red-600'>Country is required</p>}
          </div>

          <div>
            <label className='block text-lg mb-2'>Cover Letter</label>
            <textarea
              {...register('coverLetter', { required: true })}
              className='w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500'
              rows='4'
            />
            {errors.coverLetter && <p className='text-red-600'>Cover letter is required</p>}
          </div>

          <div>
            <label className='block text-lg mb-2'>CV (PDF/DOC)</label>
            <input
              type='file'
              accept=".pdf,.doc,.docx"
              {...register('cv', { required: true })}
              className='w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500'
            />
            {errors.cv && <p className='text-red-600'>CV is required</p>}
          </div>

          <div className='text-right'>
            <button
              type='submit'
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetails;
