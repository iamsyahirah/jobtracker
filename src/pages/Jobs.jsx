import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Jobs() {
    const { user } = useAuth()

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [editingJob, setEditingJob] = useState(null)

    const [form, setForm] = useState({
        company_name: '',
        position: '',
        location: '',
        job_type: '',
        job_url: '',
        salary: '',
        status: 'Applied',
        applied_date: '',
        notes: '',
    })

    const [message, setMessage] = useState('')

    const fetchJobs = async () => {
        setFetching(true)

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            setMessage(error.message)
        } else {
            setJobs(data)
        }

        setFetching(false)
    }

    useEffect(() => {
        if (user) {
            fetchJobs()
        }
    }, [user])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setMessage('')

        if (editingJob) {
            const { error } = await supabase
                .from('jobs')
                .update(form)
                .eq('id', editingJob.id)

            if (error) {
                setMessage(error.message)
                setLoading(false)
                return
            }

            setMessage('Job berjaya dikemaskini.')

            setEditingJob(null)

        } else {
            const { error } = await supabase
                .from('jobs')
                .insert({
                    user_id: user.id,
                    ...form,
                })

            if (error) {
                setMessage(error.message)
                setLoading(false)
                return
            }

            setMessage('Job berjaya ditambah.')
        }

        setForm({
            company_name: '',
            position: '',
            location: '',
            job_type: '',
            job_url: '',
            salary: '',
            status: 'Applied',
            applied_date: '',
            notes: '',
        })

        await fetchJobs()

        setLoading(false)
    }

    const handleEdit = (job) => {
        setEditingJob(job)

        setForm({
            company_name: job.company_name || '',
            position: job.position || '',
            location: job.location || '',
            job_type: job.job_type || '',
            job_url: job.job_url || '',
            salary: job.salary || '',
            status: job.status || 'Applied',
            applied_date: job.applied_date || '',
            notes: job.notes || '',
        })

        setMessage('')
    }

    const handleDelete = async (jobId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this job?'
        )

        if (!confirmed) return

        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId)

        if (error) {
            setMessage(error.message)
            return
        }

        setMessage('Job berjaya dipadam.')

        await fetchJobs()
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <h1 className="text-xl font-bold text-slate-900">
                        JobTrack
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">

                {/* Add Job Form */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        {editingJob ? 'Edit Job' : 'Add Job'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mt-5 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="company_name"
                                    value={form.company_name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Position
                                </label>

                                <input
                                    type="text"
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Job Type
                                </label>

                                <select
                                    name="job_type"
                                    value={form.job_type}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    <option value="">Select</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Job URL
                                </label>

                                <input
                                    type="url"
                                    name="job_url"
                                    value={form.job_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Salary
                                </label>

                                <input
                                    type="text"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="RM 3,000 - RM 4,000"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    <option value="Wishlist">Wishlist</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Screening">Screening</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Applied Date
                                </label>

                                <input
                                    type="date"
                                    name="applied_date"
                                    value={form.applied_date}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </div>

                        </div>

                        {message && (
                            <p className="mt-4 text-sm text-slate-600">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {loading
                                ? 'Saving...'
                                : editingJob
                                    ? 'Update Job'
                                    : 'Add Job'}
                        </button>
                    </form>
                </div>

                {/* Job List */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-900">
                        My Jobs
                    </h2>

                    {fetching ? (
                        <p className="mt-4 text-slate-500">
                            Loading jobs...
                        </p>
                    ) : jobs.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-6 text-slate-500 shadow-sm">
                            No jobs found.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="rounded-xl bg-white p-5 shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {job.position}
                                            </h3>

                                            <p className="mt-1 text-slate-600">
                                                {job.company_name}
                                            </p>

                                            {job.location && (
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {job.location}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                                {job.status}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleEdit(job)}
                                                className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(job.id)}
                                                className="rounded-lg border border-red-300 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                                        <div>
                                            <span className="font-medium">Job Type:</span>{' '}
                                            {job.job_type || '-'}
                                        </div>

                                        <div>
                                            <span className="font-medium">Salary:</span>{' '}
                                            {job.salary || '-'}
                                        </div>

                                        <div>
                                            <span className="font-medium">Applied:</span>{' '}
                                            {job.applied_date || '-'}
                                        </div>
                                    </div>

                                    {job.job_url && (
                                        <a
                                            href={job.job_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            View Job
                                        </a>
                                    )}

                                    {job.notes && (
                                        <p className="mt-4 border-t pt-4 text-sm text-slate-600">
                                            {job.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

export default Jobs