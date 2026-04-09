import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
    ArrowLeft, TrendingUp, Users, Star, Eye, Calendar, DollarSign, Award
} from 'lucide-react';
import style from './PackageDetailedAnalytics.module.css';
import * as analyticsService from '../../services/adminAnalyticsService';

const COLORS = ['#ef4444', '#f59e0b', '#fbbf24', '#a3e635', '#22c55e'];

export default function PackageDetailedAnalytics() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await analyticsService.getPackageStats(id);
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [id]);

    if (loading) return (
        <div className={style.loading}>
            <div className={style.spinner}></div>
            <p>Gathering performance data...</p>
        </div>
    );
    
    if (!stats) return <div className={style.error}>Package not found or deleted</div>;

    const { summary, timeSeries, ratingDistribution } = stats;

    // Prepare pie chart data
    const pieData = [1, 2, 3, 4, 5].map(star => {
        const d = ratingDistribution.find(rd => rd._id === star);
        return { name: `${star} Star`, value: d ? d.count : 0 };
    });

    const conversionRate = summary.views > 0 ? ((summary.totalBookings / summary.views) * 100).toFixed(1) : 0;

    return (
        <div className={style.main}>
            <div className={style.header}>
                <div className={style.headerLeft}>
                    <button className={style.backBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <h1 className={style.title}>{summary.title}</h1>
                </div>
                <div className={style.headerRight}>
                    <div className={style.dateBadge}>
                        <Calendar size={16} />
                        Last 30 Days
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className={style.summaryGrid}>
                <div className={style.card}>
                    <div className={style.cardInner}>
                        <div className={style.cardHeader}>
                            <span className={style.cardLabel}>Revenue</span>
                            <DollarSign size={18} color="#059669" />
                        </div>
                        <h2 className={style.cardValue}>₹{summary.totalRevenue?.toLocaleString()}</h2>
                        <span className={style.cardTrend} style={{ color: '#059669' }}>
                            <TrendingUp size={14} /> Total Earnings
                        </span>
                    </div>
                </div>
                <div className={style.card}>
                    <div className={style.cardInner}>
                        <div className={style.cardHeader}>
                            <span className={style.cardLabel}>Bookings</span>
                            <Users size={18} color="#3b82f6" />
                        </div>
                        <h2 className={style.cardValue}>{summary.totalBookings}</h2>
                        <span className={style.cardTrend} style={{ color: '#3b82f6' }}>Confirmed Tours</span>
                    </div>
                </div>
                <div className={style.card}>
                    <div className={style.cardInner}>
                        <div className={style.cardHeader}>
                            <span className={style.cardLabel}>Avg Rating</span>
                            <Star size={18} color="#f59e0b" />
                        </div>
                        <h2 className={style.cardValue}>{summary.averageRating?.toFixed(1) || 'N/A'}</h2>
                        <span className={style.cardTrend} style={{ color: '#f59e0b' }}>From {summary.totalReviews} reviews</span>
                    </div>
                </div>
                <div className={style.card}>
                    <div className={style.cardInner}>
                        <div className={style.cardHeader}>
                            <span className={style.cardLabel}>Reach</span>
                            <Eye size={18} color="#8b5cf6" />
                        </div>
                        <h2 className={style.cardValue}>{summary.views || 0}</h2>
                        <span className={style.cardTrend} style={{ color: '#8b5cf6' }}>Unique Page Views</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className={style.chartsGrid}>
                {/* Sales & Revenue Over Time */}
                <div className={`${style.chartCard} ${style.large}`}>
                    <h3><TrendingUp size={20} color="#3b82f6" /> Performance Trends</h3>
                    <div className={style.chartBox}>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={timeSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    name="Revenue (₹)"
                                    stroke="#3b82f6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                                <Bar dataKey="bookings" name="Bookings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className={style.chartCard}>
                    <h3><Award size={20} color="#f59e0b" /> User Sentiment</h3>
                    <div className={style.chartBox}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Comparison */}
                <div className={style.chartCard}>
                    <h3><Users size={20} color="#FF5100" /> Conversion Funnel</h3>
                    <div className={style.chartBox}>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart 
                                data={[
                                    { name: 'Total Views', count: summary.views, fill: '#cbd5e1' },
                                    { name: 'Bookings', count: summary.totalBookings, fill: '#f97316' }
                                ]}
                                layout="vertical"
                                margin={{ left: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={40}>
                                    { [1, 2].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#cbd5e1' : '#f97316'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className={style.conversionFooter}>
                            <span>Platform average conversion is ~3.2%</span>
                            <strong>Your Growth: {conversionRate}%</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
