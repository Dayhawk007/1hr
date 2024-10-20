import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobForm = (props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [client, setClient] = useState('');
    const [location, setLocation] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [compensationStart, setCompensationStart] = useState('');
    const [compensationEnd, setCompensationEnd] = useState('');
    const [experienceRange, setExperienceRange] = useState({ min: '', max: '' });
    const [questions, setQuestions] = useState([{ questionText: '', questionType: 'text', options: [] }]);
    const [clients, setClients] = useState([]); // State to store fetched clients
    const [rounds, setRounds] = useState(1);
    const [mode, setMode] = useState('');
    const [jobId, setJobId] = useState(null);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const locationState = useLocation().state;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client`);
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setErrors(prev => ({ ...prev, fetchClients: 'Failed to fetch clients' }));
            }
        };

        fetchClients();

        if (locationState) {
            setTitle(locationState.title || '');
            setDescription(locationState.description || '');
            setClient(locationState.clientReference._id || '');
            setLocation(locationState.location || '');
            setApplicationDeadline(locationState.applicationDeadline || '');
            setCompensationStart(locationState.compensationStart || '');
            setCompensationEnd(locationState.compensationEnd || '');
            setQuestions(locationState.questions || [{ questionText: '', questionType: 'text', options: [] }]);
            setExperienceRange(locationState.experienceRange || { min: '', max: '' });
            setRounds(locationState.rounds ? locationState.rounds.filter(round => round.stage === 'stage 2').length : 1);
            setMode(locationState.mode || '');
            setJobId(locationState._id || null);
        }
    }, [locationState]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'title':
                setTitle(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'client':
                setClient(value);
                break;
            case 'location':
                setLocation(value);
                break;
            case 'applicationDeadline':
                setApplicationDeadline(value);
                break;
            case 'compensationStart':
                setCompensationStart(value);
                break;
            case 'compensationEnd':
                setCompensationEnd(value);
                break;
            case 'experienceMin':
                setExperienceRange({ ...experienceRange, min: value });
                break;
            case 'experienceMax':
                setExperienceRange({ ...experienceRange, max: value });
                break;
            case 'rounds':
                setRounds(parseInt(value));
                break;
            case 'mode':
                setMode(value);
                break;
            default:
                break;
        }
        // Clear the error for the field being changed
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', questionType: 'text', options: [] }]);
    };

    const handleQuestionChange = (index, event) => {
        const { name, value } = event.target;
        const updatedQuestions = [...questions];
        updatedQuestions[index][name] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = event.target.value;
        setQuestions(updatedQuestions);
    };

    const handleAddOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.splice(optionIndex, 1);
        setQuestions(updatedQuestions);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!client) newErrors.client = 'Client is required';
        if (!location.trim()) newErrors.location = 'Location is required';
        if (!applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
        if (!compensationStart) newErrors.compensationStart = 'Compensation start is required';
        if (!compensationEnd) newErrors.compensationEnd = 'Compensation end is required';
        if (!experienceRange.min) newErrors.experienceMin = 'Minimum experience is required';
        if (!experienceRange.max) newErrors.experienceMax = 'Maximum experience is required';
        if (parseInt(experienceRange.min) > parseInt(experienceRange.max)) {
            newErrors.experienceRange = 'Minimum experience cannot be greater than maximum experience';
        }
        if (parseInt(compensationStart) > parseInt(compensationEnd)) {
            newErrors.compensation = 'Compensation start cannot be greater than compensation end';
        }
        if (questions.some(q => !q.questionText.trim())) {
            newErrors.questions = 'All questions must have text';
        }
        if (questions.some(q => q.questionType === 'multiple-choice' && q.options.length < 2)) {
            newErrors.questions = 'Multiple choice questions must have at least 2 options';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        try {
            const defaultRounds = [
                { name: 'pre-screen', stage: 'stage 1' },
                { name: 'pre-screen-rejected', stage: 'rejected' },
                { name: 'pre-interview', stage: 'stage 1' },
                { name: 'hired', stage: 'hired' },
                { name: 'rejected', stage: 'rejected' },
            ];

            const stage2Rounds = Array.from({ length: rounds }, (_, i) => ({
                name: `round ${i + 1}`,
                stage: 'stage 2'
            }));

            const jobData = {
                title,
                description,
                clientReference: client,
                location,
                applicationDeadline,
                compensationStart: compensationStart,
                compensationEnd: compensationEnd,
                questions,
                experienceRange,
                rounds: [...defaultRounds, ...stage2Rounds],
                mode,
            };

            let response;
            if (jobId) {
                response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}`, jobData);
                console.log('Job posting updated successfully!', response.data);
                alert('Job posting updated successfully!');
            } else {
                response = await axios.post(`${process.env.REACT_APP_API_URL}/api/jobPosting`, jobData);
                console.log('Job posting created successfully!', response.data);
                alert('Job posting created successfully!');
            }

            navigate('/job-posting');
        } catch (error) {
            console.error('Error saving job posting:', error);
            setErrors(prev => ({ ...prev, submit: 'Error saving job posting. Please try again.' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-white flex flex-col px-4 py-12 items-center justify-center text-white">
            <div className="w-full max-w-6xl mx-auto bg-primary shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">{jobId ? 'Update' : 'Create'} Job Posting</h1>
                {errors.submit && <div className="text-red-500 mb-4">{errors.submit}</div>}

                {/* Render form fields with error messages */}
                <div>
                    <label htmlFor="title" className="block text-white mb-1">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                    {errors.title && <div className="text-red-500">{errors.title}</div>}
                </div>
                <div>
                    <label htmlFor="description" className="block text-white mb-1">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                    {errors.description && <div className="text-red-500">{errors.description}</div>}
                </div>
                <div>
                    <label htmlFor="client" className="block text-white mb-1">Client:</label>
                    <select
                        id="client"
                        name="client"
                        value={client}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    >
                        <option value="">Select Client</option>
                        {clients.clients !== undefined && clients.clients.map((clientOption) => (
                            <option key={clientOption.id} value={clientOption._id}>
                                {clientOption.name}
                            </option>
                        ))}
                    </select>
                    {errors.client && <div className="text-red-500">{errors.client}</div>}
                </div>
                <div>
                    <label htmlFor="location" className="block text-white mb-1">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                    {errors.location && <div className="text-red-500">{errors.location}</div>}
                </div>
                <div>
                    <label htmlFor="applicationDeadline" className="block text-white mb-1">Application Deadline:</label>
                    <input
                        type="date"
                        id="applicationDeadline"
                        name="applicationDeadline"
                        value={applicationDeadline ? new Date(applicationDeadline).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                    {errors.applicationDeadline && <div className="text-red-500">{errors.applicationDeadline}</div>}
                </div>
                <div>
                    <label htmlFor="mode" className="block text-white mb-1">Mode:</label>
                    <select
                        id="mode"
                        name="mode"
                        value={mode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    >
                        <option value="">Select Mode</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="WFO">WFO (Work From Office)</option>
                        <option value="WFH">WFH (Work From Home)</option>
                    </select>
                    {errors.mode && <div className="text-red-500">{errors.mode}</div>}
                </div>
                <div>
                    <label htmlFor="compensationStart" className="block text-white mb-1">Compensation Start:</label>
                    <input
                        type="text"
                        id="compensationStart"
                        name="compensationStart"
                        value={compensationStart !== null && compensationStart !== undefined ? Number(compensationStart).toLocaleString() : ''}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, ''); // Remove commas before storing
                            if (!isNaN(rawValue)) handleInputChange({ target: { name: 'compensationStart', value: rawValue } });
                        }}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                    {errors.compensationStart && <div className="text-red-500">{errors.compensationStart}</div>}
                </div>

                <div>
                    <label htmlFor="compensationEnd" className="block text-white mb-1">Compensation End:</label>
                    <input
                        type="text"
                        id="compensationEnd"
                        name="compensationEnd"
                        value={compensationEnd !== null && compensationEnd !== undefined ? Number(compensationEnd).toLocaleString() : ''}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, ''); // Remove commas before storing
                            if (!isNaN(rawValue)) handleInputChange({ target: { name: 'compensationEnd', value: rawValue } });
                        }}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                    {errors.compensationEnd && <div className="text-red-500">{errors.compensationEnd}</div>}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Experience Range</h2>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="experienceMin" className="block text-white mb-1">Minimum Experience (years):</label>
                            <input
                                type="text"
                                id="experienceMin"
                                name="experienceMin"
                                value={experienceRange.min}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            />
                            {errors.experienceMin && <div className="text-red-500">{errors.experienceMin}</div>}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="experienceMax" className="block text-white mb-1">Maximum Experience (years):</label>
                            <input
                                type="text"
                                id="experienceMax"
                                name="experienceMax"
                                value={experienceRange.max}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            />
                            {errors.experienceMax && <div className="text-red-500">{errors.experienceMax}</div>}
                        </div>
                    </div>
                    {errors.experienceRange && <div className="text-red-500">{errors.experienceRange}</div>}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <label htmlFor={`questionText-${index}`} className="block text-white mb-1">Question Text:</label>
                            <input
                                type="text"
                                id={`questionText-${index}`}
                                name="questionText"
                                value={question.questionText}
                                onChange={(event) => handleQuestionChange(index, event)}
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            />
                            <label htmlFor={`questionType-${index}`} className="block text-white mb-1">Question Type:</label>
                            <select
                                id={`questionType-${index}`}
                                name="questionType"
                                value={question.questionType}
                                onChange={(event) => handleQuestionChange(index, event)}
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            >
                                <option value="text">Text</option>
                                <option value="multiple-choice">Multiple Choice</option>
                            </select>
                            {question.questionType === 'multiple-choice' && (
                                <div className='flex flex-col space-y-2 py-4'>
                                    <label htmlFor={`options-${index}`} className="block text-white mb-1">Options:</label>
                                    <div className='flex flex-row space-x-4'>
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex flex-row items-center space-x-2">
                                                <input
                                                    type="text"
                                                    id={`option-${index}-${optionIndex}`}
                                                    name="option"
                                                    value={option}
                                                    onChange={(event) => handleOptionChange(index, optionIndex, event)}
                                                    className="px-4 py-2 rounded bg-white text-black focus:outline-none flex-grow"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(index, optionIndex)}
                                                    className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleAddOption(index)}
                                            className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 self-start"
                                        >
                                            Add Option
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {errors.questions && <div className="text-red-500">{errors.questions}</div>}
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="bg-white text-primary px-4 py-2 rounded mt-2 hover:bg-gray-100"
                    >
                        Add Question
                    </button>
                </div>
                <div>
                    <label htmlFor="rounds" className="block text-white mb-1">Number of Stage 2 Rounds:</label>
                    <select
                        id="rounds"
                        name="rounds"
                        value={rounds}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    >
                        <option value={1}>1 Round</option>
                        <option value={2}>2 Rounds</option>
                        <option value={3}>3 Rounds</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/job-posting')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100"
                    >
                        {jobId ? 'Update' : 'Create'} Job
                    </button>
                </div>
            </div>
        </form>
    );
};

export default JobForm;


