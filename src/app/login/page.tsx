import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#F9F8F3] flex items-center justify-center p-6">
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl w-full max-w-md border border-white">
                <h1 className="text-4xl font-bold text-[#1F2937] mb-2">Welcome Back.</h1>
                <p className="text-gray-500 mb-8">Manage your pages with intelligence.</p>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition" />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button formAction={login} className="bg-[#0D9488] text-white font-semibold py-3 rounded-full hover:bg-[#0b7a6f] transition shadow-lg">
                            Log in
                        </button>
                        <button formAction={signup} className="text-[#0D9488] font-medium py-2 hover:underline">
                            Create an account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}