import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">
                        JobTrack
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold text-slate-900">
                    Dashboard
                </h2>

                <p className="mt-2 text-slate-600">
                    Welcome, {user?.email}
                </p>
            </main>
        </div>
    )
}

export default Dashboard