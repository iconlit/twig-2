import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Container from '../../components/layout/Container';
import { getTickets } from '../../services/ticketService';
import { Ticket, TicketStatus } from '../../types';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import StatusTag from '../../components/ui/StatusTag';
import Button from '../../components/ui/Button';


// --- HELPER FUNCTIONS AND COMPONENTS ---

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
};
  
interface PieChartData {
    value: number;
    label: string;
    color: string;
}
  
const PieSlice: React.FC<{ slice: PieChartData; total: number; startAngle: number }> = ({ slice, total, startAngle }) => {
    const angle = (slice.value / total) * 360;
    const endAngle = startAngle + angle;
  
    const getCoordinatesForAngle = (angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
      return [
        50 + 40 * Math.cos(angleInRadians),
        50 + 40 * Math.sin(angleInRadians),
      ];
    };
  
    if (angle === 360) {
        return <circle cx="50" cy="50" r="40" fill={slice.color} />;
    }

    const [startX, startY] = getCoordinatesForAngle(startAngle);
    const [endX, endY] = getCoordinatesForAngle(endAngle);
  
    const largeArcFlag = angle > 180 ? 1 : 0;
  
    const pathData = [
      `M 50 50`,
      `L ${startX} ${startY}`,
      `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ');
  
    return <path d={pathData} fill={slice.color} />;
};
  
const PieChart: React.FC<{ data: PieChartData[] }> = ({ data }) => {
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  
    if (totalValue === 0) {
      return (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
              No ticket data to display.
          </div>
      );
    }
  
    let cumulativeAngle = 0;
  
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
          <svg viewBox="0 0 100 100">
            {data.map((slice) => {
              if (slice.value > 0) {
                const sliceComponent = (
                  <PieSlice key={slice.label} slice={slice} total={totalValue} startAngle={cumulativeAngle}/>
                );
                cumulativeAngle += (slice.value / totalValue) * 360;
                return sliceComponent;
              }
              return null;
            })}
          </svg>
        </div>
        <div className="flex flex-col space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
              <span className="text-gray-700 dark:text-gray-300">{item.label} ({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
};

const StatsCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card>
        <div className="flex items-center">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-white">{value}</dd>
                </dl>
            </div>
        </div>
    </Card>
);

// --- MAIN DASHBOARD PAGE COMPONENT ---

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });
    const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const tickets = await getTickets();
                
                const total = tickets.length;
                const open = tickets.filter(t => t.status === TicketStatus.Open).length;
                const inProgress = tickets.filter(t => t.status === TicketStatus.InProgress).length;
                const closed = tickets.filter(t => t.status === TicketStatus.Closed).length;
                setStats({ total, open, inProgress, closed });

                const sortedTickets = [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                setRecentTickets(sortedTickets.slice(0, 5));

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const iconClasses = "h-8 w-8 text-white";

    const dashboardCards = [
        { title: "Total Tickets", value: stats.total, icon: <div className="p-3 rounded-md bg-indigo-500"><svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></div> },
        { title: "Open Tickets", value: stats.open, icon: <div className="p-3 rounded-md bg-green-500"><svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div> },
        { title: "In Progress", value: stats.inProgress, icon: <div className="p-3 rounded-md bg-amber-500"><svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.006h-4.992a8.25 8.25 0 01-11.667 0c0 0 0 0 0 0l-3.182 3.182" /></svg></div> },
        { title: "Resolved Tickets", value: stats.closed, icon: <div className="p-3 rounded-md bg-gray-500"><svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div> },
    ];
    
    const pieChartData = [
        { label: 'Open', value: stats.open, color: '#10B981' },
        { label: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
        { label: 'Closed', value: stats.closed, color: '#6B7280' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
                <Container className="py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.email}!</h1>
                            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Here's a snapshot of your support activity.</p>
                        </div>
                        <Link to="/tickets" className="mt-4 sm:mt-0 flex-shrink-0">
                            <Button>Create New Ticket</Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Loading dashboard...</div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {dashboardCards.map(card => <StatsCard key={card.title} {...card} />)}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Card className="lg:col-span-2">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ticket Status Distribution</h2>
                                    <PieChart data={pieChartData} />
                                </Card>
                                
                                <Card>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                                    {recentTickets.length > 0 ? (
                                        <ul className="space-y-4">
                                            {recentTickets.map(ticket => (
                                                <li key={ticket.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0">
                                                    <p className="font-semibold truncate text-gray-800 dark:text-gray-200">{ticket.title}</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <StatusTag status={ticket.status} />
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatRelativeTime(ticket.updatedAt)}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            No recent activity.
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;