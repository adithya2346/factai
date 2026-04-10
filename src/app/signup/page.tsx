import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="w-full max-w-md mx-auto mt-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2">Join the Truth</h1>
        <p className="text-text-secondary">Create a FactCheckAI account</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon-green/20 blur-[60px] -z-10" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-cyan/20 blur-[60px] -z-10" />

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Full Name</label>
            <input 
              type="text" 
              placeholder="Neo"
              className="w-full px-4 py-3 bg-bg-primary/50 border border-glass-border rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green text-white placeholder-text-secondary transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Email</label>
            <input 
              type="email" 
              placeholder="neo@matrix.com"
              className="w-full px-4 py-3 bg-bg-primary/50 border border-glass-border rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green text-white placeholder-text-secondary transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg-primary/50 border border-glass-border rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green text-white placeholder-text-secondary transition-all outline-none"
            />
          </div>

          <button 
            type="button"
            className="w-full py-3 mt-4 bg-neon-green text-bg-primary font-black rounded-xl hover:bg-neon-green/90 neon-glow-green transition-all"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-cyan hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
