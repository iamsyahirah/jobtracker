import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

    const recentJobs = jobs.slice(0, 5)

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            JobTrack
                        </h1>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Welcome */}
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Dashboard
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Welcome back, {user?.email}
                    </p>
                </div>

                {/* Add Job Button */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/jobs')}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Add Job
                    </button>
                </div>

                {/* Statistics */}
                {loading ? (
                    <p className="mt-8 text-slate-500">
                        Loading dashboard...
                    </p>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Total Jobs
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {totalJobs}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Applied
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {appliedJobs}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Screening
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {screeningJobs}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Interview
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {interviewJobs}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Offers
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {offerJobs}
                            </p>
                        </div>

                    </div>
                )}

                {/* Recent Applications */}
                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">
                            Recent Applications
                        </h3>

                        <button
                            onClick={() => navigate('/jobs')}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            View all
                        </button>
                    </div>

                    {loading ? (
                        <p className="mt-4 text-slate-500">
                            Loading...
                        </p>
                    ) : recentJobs.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-slate-500">
                                No applications yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold text-slate-700">
                                                Company
                                            </th>

                                            <th className="px-5 py-4 font-semibold text-slate-700">
                                                Position
                                            </th>

                                            <th className="px-5 py-4 font-semibold text-slate-700">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 font-semibold text-slate-700">
                                                Applied
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentJobs.map((job) => (
                                            <tr
                                                key={job.id}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="px-5 py-4 font-medium text-slate-900">
                                                    {job.company_name}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {job.position}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                                        {job.status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {job.applied_date || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

export default Dashboard