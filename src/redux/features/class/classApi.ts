import { api } from '../../api';

export const classApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<any[], void>({
      query: () => '/classes',
      providesTags: ['Class'],
    }),
    getClassById: builder.query<any, string>({
      query: (id) => `/classes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Class', id }],
    }),
    addClass: builder.mutation({
      query: (classData) => ({
        url: '/classes',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/classes/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => ['Class', { type: 'Class', id }],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useAddClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
