import { api } from '../../api';

export const attendanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<any[], void>({
      query: () => '/attendance',
      providesTags: ['Attendance'],
    }),
    getAttendanceByFilter: builder.query<any[], { classId: string; date: string }>({
      query: ({ classId, date }) => `/attendance/filter?classId=${classId}&date=${date}`,
      providesTags: ['Attendance'],
    }),
    recordAttendance: builder.mutation({
      query: (attendance) => ({
        url: '/attendance',
        method: 'POST',
        body: attendance,
      }),
      invalidatesTags: ['Attendance'],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useGetAttendanceByFilterQuery,
  useRecordAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
