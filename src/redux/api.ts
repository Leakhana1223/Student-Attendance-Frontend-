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

  if (result.error && result.error.status === 401) {
    // try to get a new token
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
        // store the new token
        const { accessToken } = refreshResult.data as { accessToken: string };
        localStorage.setItem('token', accessToken);

        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // refresh failed - logout the user
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
  return result;
};

// Create a base API to be injected by features
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Student', 'Class', 'Attendance', 'Subject', 'Blacklist'],
  endpoints: () => ({}), // Endpoints are injected from the feature API slices
});
