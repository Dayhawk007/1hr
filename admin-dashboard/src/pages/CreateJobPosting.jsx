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

    const navigate=useNavigate();

    const locationState = useLocation();
    // Fetch clients on component mount
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/client');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();

        if(locationState.state){
            setTitle(locationState.state.title);
            setDescription(locationState.state.description);
            setClient(locationState.state.client);
            setLocation(locationState.state.location);
            setApplicationDeadline(locationState.state.applicationDeadline);
            setCompensationStart(locationState.state.compensationStart);
            setCompensationEnd(locationState.state.compensationEnd);
            setQuestions(locationState.state.questions);
        }
        

    }, []);

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
                setExperienceRange({...experienceRange, min: value});
                break;
            case 'experienceMax':
                setExperienceRange({...experienceRange, max: value});
                break;
            default:
                break;
        }
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!title || !description || !client || !location || !applicationDeadline || !compensationStart || !compensationEnd || !experienceRange.min || !experienceRange.max) {
            alert('All fields are required.');
            return;
        }

        // More complex validation can be added here, e.g., checking date format, numeric values, etc.

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/jobPosting', {
                title,
                description,
                clientReference: client,
                location,
                applicationDeadline,
                compensationStart,
                compensationEnd,
                questions,
                experienceRange
            });

            // Handle successful submission
            console.log('Job posting created successfully!', response.data);
            alert('Job posting created successfully!');
            navigate('/job-posting');
            
        } catch (error) {
            // Handle errors
            console.error('Error creating job posting:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-white flex flex-col px-4 py-12 items-center justify-center text-white">
            <div className="w-full max-w-6xl mx-auto bg-primary shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Create Job Posting</h1>
                <div>
                    <label htmlFor="title" className="block text-white mb-1">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-white mb-1">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="client" className="block text-white mb-1">
                        Client:
                    </label>
                    <select
                        id="client"
                        name="client"
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    >
                        <option value="">Select Client</option>
                        {clients.map((clientOption) => (
                            <option key={clientOption.id} value={clientOption._id}>
                                {clientOption.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block text-white mb-1">
                        Location:
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="applicationDeadline" className="block text-white mb-1">
                        Application Deadline:
                    </label>
                    <input
                        type="date"
                        id="applicationDeadline"
                        name="applicationDeadline"
                        value={applicationDeadline}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="compensationStart" className="block text-white mb-1">
                        Compensation Start:
                    </label>
                    <input
                        type="number"
                        id="compensationStart"
                        name="compensationStart"
                        value={compensationStart}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="compensationEnd" className="block text-white mb-1">
                        Compensation End:
                    </label>
                    <input
                        type="number"
                        id="compensationEnd"
                        name="compensationEnd"
                        value={compensationEnd}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Experience Range</h2>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="experienceMin" className="block text-white mb-1">
                                Minimum Experience (years):
                            </label>
                            <input
                                type="number"
                                id="experienceMin"
                                name="experienceMin"
                                value={experienceRange.min}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="experienceMax" className="block text-white mb-1">
                                Maximum Experience (years):
                            </label>
                            <input
                                type="number"
                                id="experienceMax"
                                name="experienceMax"
                                value={experienceRange.max}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <label htmlFor={`questionText-${index}`} className="block text-white mb-1">
                                Question Text:
                            </label>
                            <input
                                type="text"
                                id={`questionText-${index}`}
                                name="questionText"
                                value={question.questionText}
                                onChange={(event) => handleQuestionChange(index, event)}
                                required
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            />
                            <label htmlFor={`questionType-${index}`} className="block text-white mb-1">
                                Question Type:
                            </label>
                            <select
                                id={`questionType-${index}`}
                                name="questionType"
                                value={question.questionType}
                                onChange={(event) => handleQuestionChange(index, event)}
                                required
                                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                            >
                                <option value="text">Text</option>
                                <option value="multiple-choice">Multiple Choice</option>
                            </select>
                            {question.questionType === 'multiple-choice' && (
                                <div className='flex flex-col space-y-2 py-4'>
                                    <label htmlFor={`options-${index}`} className="block text-white mb-1">
                                        Options:
                                    </label>
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
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="bg-white text-primary px-4 py-2 rounded mt-2 hover:bg-gray-100"
                    >
                        Add Question
                    </button>
                </div>
                    <div className="flex justify-end space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={() => { /* Handle cancel logic */ }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100"
                    >
                        Create Job
                    </button>
                </div>
            </div>
        </form>
    );
};



export default JobForm;


