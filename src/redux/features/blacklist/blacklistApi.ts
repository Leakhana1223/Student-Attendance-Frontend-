import { api } from '../../api';

export const blacklistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlacklist: builder.query<any[], { months?: number; classId?: string } | void>({
      query: (params) => {
        const { months, classId } = params || {};
        let url = '/blacklist?';
        if (months) url += `months=${months}&`;
        if (classId && classId !== 'all') url += `classId=${classId}&`;
        return url;
      },
      providesTags: ['Blacklist'],
    }),
    getBlacklistHistory: builder.query<any[], { months?: number; classId?: string } | void>({
      query: (params) => {
        const { months, classId } = params || {};
        let url = '/blacklist/history?';
        if (months) url += `months=${months}&`;
        if (classId && classId !== 'all') url += `classId=${classId}&`;
        return url;
      },
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
  useGetBlacklistHistoryQuery,
  useAddToBlacklistMutation,
  useRemoveFromBlacklistMutation,
  useCheckBlacklistQuery,
} = blacklistApi;
