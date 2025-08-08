import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [language, setLanguage] = useState('English'); // Add language state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('bill', file);
    formData.append('language', language); // Append selected language

    try {
      const response = await axios.post(
        'https://voiceyourbill-server.onrender.com/api/bills/upload',
        formData
      );
      const { billId } = response.data;
      setIsLoading(false);
      navigate(`/analysis/${billId}`);
    } catch (err) {
      setIsLoading(false);
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-10 p-8 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Upload Your Bill for Analysis
        </h2>
        <p className="text-gray-500 mt-2">
          Supports images and PDF files. Your data is secure.
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Summary Language
        </label>
        <select
          id="language"
          name="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                     focus:outline-none focus:ring-green-500 focus:border-green-500 
                     sm:text-sm rounded-md"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
          <option>Tamil</option>
          <option>Spanish</option>
        </select>
      </div>

      {/* File Upload */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Choose File
        </label>
        <span className="text-gray-600 mt-4">{fileName}</span>
      </div>

      {/* Analyze Button */}
      <div className="mt-6">
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg 
                     hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Bill'}
        </button>
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
