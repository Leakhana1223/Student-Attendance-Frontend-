import { api } from '../../api';

export const reportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentReports: builder.query<any[], { classId?: string } | void>({
      query: (params) => {
        const { classId } = params || {};
        let url = '/reports/students';
        if (classId && classId !== 'all') url += `?classId=${classId}`;
        return url;
      },
      providesTags: ['Attendance', 'Student'],
    }),
  }),
});

export const {
  useGetStudentReportsQuery,
} = reportApi;
