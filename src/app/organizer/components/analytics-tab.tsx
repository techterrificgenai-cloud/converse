'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { sessions } from '@/lib/data';
import type { SessionTrack } from '@/lib/types';

const trackData = sessions.reduce((acc, session) => {
  acc[session.track] = (acc[session.track] || 0) + 1;
  return acc;
}, {} as Record<SessionTrack, number>);

const pieData = Object.entries(trackData).map(([name, value]) => ({ name, value }));

const statusData = sessions.reduce((acc, session) => {
    if (session.status !== 'Pending') {
      acc[session.status] = (acc[session.status] || 0) + 1;
    }
    return acc;
  }, {} as Record<'Accepted' | 'Rejected', number>);
  
const barData = [{ name: 'Submissions', ...statusData }];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export function AnalyticsTab() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sessions by Track</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Acceptance Ratio</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Accepted" fill="#00C49F" />
              <Bar dataKey="Rejected" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
