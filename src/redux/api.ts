import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create a base API to be injected by features
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Student', 'Class', 'Attendance', 'Subject', 'Blacklist'],
  endpoints: () => ({}), // Endpoints are injected from the feature API slices
});
