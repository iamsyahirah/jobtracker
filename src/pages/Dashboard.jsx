import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    ChevronRight,
    Clock3,
    LayoutDashboard,
    LogOut,
    Plus,
    Search,
    Send,
    Sparkles,
    Trophy,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const fetchJobs = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setJobs(data || [])
        }

        setLoading(false)
    }

    useEffect(() => {
        if (user) {
            fetchJobs()
        }
    }, [user])

    const totalJobs = jobs.length

    const appliedJobs = jobs.filter(
        (job) => job.status === 'Applied'
    ).length

    const screeningJobs = jobs.filter(
        (job) => job.status === 'Screening'
    ).length

    const interviewJobs = jobs.filter(
        (job) => job.status === 'Interview'
    ).length

    const offerJobs = jobs.filter(
        (job) => job.status === 'Offer'
    ).length

    const rejectedJobs = jobs.filter(
        (job) => job.status === 'Rejected'
    ).length

    const recentJobs = jobs.slice(0, 5)

    const getStatusStyle = (status) => {
        const styles = {
            Wishlist: 'bg-slate-100 text-slate-600',
            Applied: 'bg-orange-50 text-orange-600',
            Screening: 'bg-blue-50 text-blue-600',
            Interview: 'bg-purple-50 text-purple-600',
            Offer: 'bg-green-50 text-green-600',
            Rejected: 'bg-red-50 text-red-500',
            Withdrawn: 'bg-gray-100 text-gray-500',
        }

        return styles[status] || 'bg-slate-100 text-slate-600'
    }

    const getProgress = () => {
        if (totalJobs === 0) return 0
        return Math.round((interviewJobs + offerJobs) / totalJobs * 100)
    }

    return (
        <div className="min-h-screen bg-[#f3f3f2]">

            {/* Main Dashboard */}
            <div className="mx-auto min-h-screen max-w-[1500px] bg-white">

                {/* Header */}
                <header className="border-b border-slate-100">
                    <div className="flex items-center justify-between px-6 py-5 lg:px-10">

                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                                JT
                            </div>

                            <div>
                                <h1 className="text-lg font-semibold text-slate-900">
                                    JobTrack
                                </h1>

                                <p className="text-xs text-slate-400">
                                    Job Application Dashboard
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden items-center gap-7 md:flex">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 text-sm font-medium text-slate-900"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </button>

                            <button
                                onClick={() => navigate('/jobs')}
                                className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
                            >
                                <BriefcaseBusiness size={16} />
                                Jobs
                            </button>
                        </nav>

                        {/* Right */}
                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => navigate('/jobs')}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                                title="Add Job"
                            >
                                <Plus size={18} />
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                                title="Logout"
                            >
                                <LogOut size={17} />
                            </button>

                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="px-6 py-8 lg:px-10 lg:py-10">

                    {/* Hero */}
                    <section className="grid gap-8 lg:grid-cols-2 lg:items-center">

                        <div>
                            <p className="mb-3 text-sm font-medium text-orange-500">
                                Your job search
                            </p>

                            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
                                Keep moving forward
                                <span className="ml-2">👋</span>
                            </h2>

                            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
                                Track your applications, stay organised and keep
                                an eye on your next opportunity.
                            </p>

                            <button
                                onClick={() => navigate('/jobs')}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ed6847] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#df5b3b]"
                            >
                                <Plus size={17} />
                                Add new application
                            </button>
                        </div>

                        {/* Search */}
                        <div className="hidden justify-end lg:flex">
                            <div className="flex w-full max-w-sm items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-slate-400">
                                <Search size={18} />

                                <span className="text-sm">
                                    Search your applications...
                                </span>
                            </div>
                        </div>

                    </section>

                    {/* Statistics */}
                    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                    <BriefcaseBusiness size={18} />
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="text-slate-300"
                                />
                            </div>

                            <p className="mt-7 text-sm text-slate-400">
                                Total jobs
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-slate-950">
                                {loading ? '—' : totalJobs}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                    <Send size={18} />
                                </div>
                            </div>

                            <p className="mt-7 text-sm text-slate-400">
                                Applied
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-slate-950">
                                {loading ? '—' : appliedJobs}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                <Clock3 size={18} />
                            </div>

                            <p className="mt-7 text-sm text-slate-400">
                                Screening
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-slate-950">
                                {loading ? '—' : screeningJobs}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                                <CalendarDays size={18} />
                            </div>

                            <p className="mt-7 text-sm text-slate-400">
                                Interviews
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-slate-950">
                                {loading ? '—' : interviewJobs}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500">
                                <Trophy size={18} />
                            </div>

                            <p className="mt-7 text-sm text-slate-400">
                                Offers
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-slate-950">
                                {loading ? '—' : offerJobs}
                            </p>
                        </div>

                    </section>

                    {/* Main Grid */}
                    <section className="mt-6 grid gap-6 lg:grid-cols-3">

                        {/* Recent Applications */}
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-950">
                                        Recent applications
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Your latest job applications
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
                                >
                                    View all
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {loading ? (
                                <div className="py-16 text-center text-sm text-slate-400">
                                    Loading applications...
                                </div>
                            ) : recentJobs.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <BriefcaseBusiness size={20} />
                                    </div>

                                    <p className="mt-4 font-medium text-slate-700">
                                        No applications yet
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Start tracking your job search.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 divide-y divide-slate-100">

                                    {recentJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="flex items-center justify-between gap-4 py-4"
                                        >

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                                                    {job.company_name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-slate-900">
                                                        {job.position}
                                                    </p>

                                                    <p className="mt-1 truncate text-sm text-slate-400">
                                                        {job.company_name}
                                                        {job.location
                                                            ? ` · ${job.location}`
                                                            : ''}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="shrink-0 text-right">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                                        job.status
                                                    )}`}
                                                >
                                                    {job.status}
                                                </span>

                                                <p className="mt-2 text-xs text-slate-400">
                                                    {job.applied_date || 'No date'}
                                                </p>

                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}

                        </div>

                        {/* Progress */}
                        <div className="rounded-3xl border border-slate-100 bg-[#fafafa] p-6 shadow-sm">

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-950">
                                        Application progress
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Applications reaching interviews
                                    </p>
                                </div>

                                <Sparkles
                                    size={19}
                                    className="text-orange-500"
                                />
                            </div>

                            <div className="mt-10 flex items-center justify-center">

                                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-orange-100">

                                    <div className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-[#ed6847] border-r-[#ed6847] rotate-[-25deg]" />

                                    <div className="text-center">
                                        <p className="text-3xl font-semibold text-slate-950">
                                            {loading ? '—' : `${getProgress()}%`}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            progress
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="mt-8 space-y-4">

                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Applied
                                        </span>

                                        <span className="font-medium text-slate-900">
                                            {appliedJobs}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                                        <div
                                            className="h-2 rounded-full bg-orange-400"
                                            style={{
                                                width:
                                                    totalJobs > 0
                                                        ? `${(appliedJobs / totalJobs) * 100}%`
                                                        : '0%',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Interviews
                                        </span>

                                        <span className="font-medium text-slate-900">
                                            {interviewJobs}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                                        <div
                                            className="h-2 rounded-full bg-purple-400"
                                            style={{
                                                width:
                                                    totalJobs > 0
                                                        ? `${(interviewJobs / totalJobs) * 100}%`
                                                        : '0%',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Rejected
                                        </span>

                                        <span className="font-medium text-slate-900">
                                            {rejectedJobs}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                                        <div
                                            className="h-2 rounded-full bg-red-300"
                                            style={{
                                                width:
                                                    totalJobs > 0
                                                        ? `${(rejectedJobs / totalJobs) * 100}%`
                                                        : '0%',
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>

                    </section>

                    {/* Bottom cards */}
                    <section className="mt-6 grid gap-6 md:grid-cols-2">

                        <div className="rounded-3xl bg-[#f7f7f5] p-6">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                <CalendarDays size={18} />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-slate-950">
                                Stay on top of interviews
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Keep your upcoming interviews and important
                                application dates organised in one place.
                            </p>

                        </div>

                        <div className="rounded-3xl bg-[#ed6847] p-6 text-white">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <Sparkles size={18} />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold">
                                Keep building momentum
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                                Every application is another step towards
                                your next opportunity.
                            </p>

                            <button
                                onClick={() => navigate('/jobs')}
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900"
                            >
                                View applications
                                <ArrowUpRight size={16} />
                            </button>

                        </div>

                    </section>

                </main>
            </div>
        </div>
    )
}

export default Dashboard