"use client";

import { useState, useEffect } from 'react';

interface Subscriber {
  id: number;
  email: string;
  createdAt: string; // Dates will be received as strings from the API
}

interface FormattedDate {
  datePart: string;
  timePart: string;
}

// NOTE: This is a very basic password protection for MVP validation only.
// For a real application, implement a proper authentication system.
const PAGE_PASSWORD = process.env.NEXT_PUBLIC_SUBSCRIBERS_PASSWORD || 'a@b@d0m$tr0ngP@$$wOrd!123'; // **Change this password!**

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State to toggle between the two specific formats - set to true for Format 2 by default
  const [showSlashFormat, setShowSlashFormat] = useState(true);

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch data if authenticated
    if (isAuthenticated) {
      const fetchSubscribers = async () => {
        try {
          const response = await fetch('/api/subscribers');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Subscriber[] = await response.json();
          setSubscribers(data);
        } catch (error) {
          if (error instanceof Error) {
            setError('Failed to load subscribers: ' + error.message);
          } else {
            setError('Failed to load subscribers: Unknown error');
          }
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscribers();
    } else {
      setLoading(false); // Stop loading if not authenticated initially
    }
  }, [isAuthenticated]); // Rerun effect when authentication state changes

  // Modified formatDate function to return an object with date and time parts
  const formatDate = (dateString: string): FormattedDate => {
    if (!dateString) return { datePart: 'N/A', timePart: '' };

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date string:", dateString);
        return { datePart: 'Invalid Date', timePart: '' };
      }

      const year = date.getFullYear();
      const monthName = date.toLocaleString('default', { month: 'long' });
      const monthNumber = date.getMonth() + 1;
      const day = date.getDate();
      let hour = date.getHours();
      const minute = date.getMinutes();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      const formattedMinute = minute < 10 ? '0' + minute : minute;

      const timePart = `${hour}:${formattedMinute}${ampm.toLowerCase()}`;
      let datePart;

      if (showSlashFormat) {
        // Format 2: Year/MonthNumber/Day
        datePart = `${year}/${monthNumber}/${day}`;
      } else {
        // Format 1: Year MonthName Day
        datePart = `${year} ${monthName} ${day}`;
      }

      return { datePart, timePart };

    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return { datePart: 'Error', timePart: '' };
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PAGE_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(null);
    } else {
      setIsAuthenticated(false);
      setPasswordError("Incorrect password.");
    }
  };

  // Display password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Subscribers Area</h1>
          <p className="text-gray-600 mb-6">Please enter the password to access this page.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Display loading or error if authenticated but data is not ready
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-gray-200"></div>
        <p className="mt-4 text-gray-700 text-lg">Loading subscribers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800 p-6 rounded-md shadow-md m-4 text-center">
        <svg className="w-12 h-12 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Display subscribers if authenticated and data is loaded
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Subscribers</h1>

        {/* Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowSlashFormat(!showSlashFormat)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            {showSlashFormat ? "Format 1" : "Format 2"}
          </button>
        </div>

        {subscribers.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h2c.512 0 1.02.019 1.518.075A2.004 2.004 0 0111 7v1.586a1.994 1.994 0 01-.586 1.414L9.172 11H7m2-6h2m4 0h2a2 2 0 012 2v7m-4 4H11a2 2 0 01-2-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1a2 2 0 002 2h2m2-4h.01M15 13H9.3a1 1 0 00-.877.574L7 17m0 0v-.01M15 17v-.01"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subscribers</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by sharing your landing page to collect emails.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber, index) => {
                   const formattedDate = formatDate(subscriber.createdAt);
                  return (
                  <tr key={subscriber.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </td>
                    {/* Apply flexbox to push time to the right */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-between items-center">
                       <span>{formattedDate.datePart}</span>
                       <span className="text-gray-600 font-medium">{formattedDate.timePart}</span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 