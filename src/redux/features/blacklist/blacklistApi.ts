import { api } from '../../api';

export const blacklistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlacklist: builder.query<any[], void>({
      query: () => '/blacklist',
      providesTags: ['Blacklist'],
    }),
    addToBlacklist: builder.mutation({
      query: (entry) => ({
        url: '/blacklist',
        method: 'POST',
        body: entry,
      }),
      invalidatesTags: ['Blacklist'],
    }),
    removeFromBlacklist: builder.mutation({
      query: (id) => ({
        url: `/blacklist/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blacklist'],
    }),
    checkBlacklist: builder.query<boolean, string>({
      query: (studentId) => `/blacklist/check/${studentId}`,
      providesTags: (result, error, id) => [{ type: 'Blacklist', id }],
    }),
  }),
});

export const {
  useGetBlacklistQuery,
  useAddToBlacklistMutation,
  useRemoveFromBlacklistMutation,
  useCheckBlacklistQuery,
} = blacklistApi;
