import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto mt-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h1>
        <p className="text-text-secondary">Sign in to your FactCheckAI account</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-purple/20 blur-[60px] -z-10" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-cyan/20 blur-[60px] -z-10" />

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Email</label>
            <input 
              type="email" 
              placeholder="agent@reality.com"
              className="w-full px-4 py-3 bg-bg-primary/50 border border-glass-border rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-neon-purple text-white placeholder-text-secondary transition-all outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <a href="#" className="text-xs text-neon-cyan hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg-primary/50 border border-glass-border rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-neon-purple text-white placeholder-text-secondary transition-all outline-none"
            />
          </div>

          <button 
            type="button"
            className="w-full py-3 mt-4 bg-neon-purple text-white font-bold rounded-xl hover:bg-neon-purple/90 neon-glow-purple transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="text-neon-cyan hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
