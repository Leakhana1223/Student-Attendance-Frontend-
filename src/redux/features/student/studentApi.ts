import { api } from '../../api';

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<any[], void>({
      query: () => '/students',
      providesTags: ['Student'],
    }),
    getStudentById: builder.query<any, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    addStudent: builder.mutation({
      query: ({ classId, ...student }) => ({
        url: `/students?classId=${classId}`,
        method: 'POST',
        body: student,
      }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, classId, ...updates }) => ({
        url: `/students/${id}?classId=${classId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => ['Student', { type: 'Student', id }],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
