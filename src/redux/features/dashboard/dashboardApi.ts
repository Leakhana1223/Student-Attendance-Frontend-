import { api } from '../../api';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<{ totalStudents: number; totalClasses: number; totalAttendance: number }, void>({
      query: () => '/dashboard/stats',
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
