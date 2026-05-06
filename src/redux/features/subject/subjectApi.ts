import { api } from '../../api';

export const subjectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<any[], void>({
      query: () => '/subjects',
      providesTags: ['Subject'],
    }),
    getSubjectById: builder.query<any, string>({
      query: (id) => `/subjects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
    }),
    addSubject: builder.mutation({
      query: (subject) => ({
        url: '/subjects',
        method: 'POST',
        body: subject,
      }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/subjects/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => ['Subject', { type: 'Subject', id }],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
