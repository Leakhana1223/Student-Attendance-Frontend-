import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 — attempt token refresh
  if (result.error && result.error.status === 401) {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refreshtoken',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string };
        localStorage.setItem('token', token);
        // Retry original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — log out user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    }
  }

  // For network-level errors on GET requests only: return empty array to prevent crash
  // Mutations (POST/PUT/PATCH/DELETE) must propagate errors so UI can show feedback
  if (result.error && result.error.status === 'FETCH_ERROR') {
    const method = typeof args === 'string' ? 'GET' : (args.method?.toUpperCase() || 'GET');
    if (method === 'GET') {
      console.warn('Network error on GET request, returning empty array:', args);
      return { data: [] };
    }
    // Let mutation errors propagate naturally
    console.error('Network error on mutation:', args, result.error);
  }

  return result;
};

// Create a base API to be injected by features
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Student', 'Class', 'Attendance', 'Subject', 'Blacklist', 'Report'],
  endpoints: () => ({}), // Endpoints are injected from the feature API slices
});
