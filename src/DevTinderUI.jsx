export default function DevTinderUI() {
  const profiles = [
    {
      name: 'Aarav',
      role: 'Frontend Developer',
      skills: ['React', 'Redux', 'Tailwind'],
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Priya',
      role: 'Backend Developer',
      skills: ['Node.js', 'MongoDB', 'JWT'],
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Rohan',
      role: 'Full Stack Developer',
      skills: ['React Native', 'Firebase', 'Express'],
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <h1 className="text-3xl font-bold tracking-wide text-pink-500">
          DevTinder
        </h1>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-900 transition">
            Login
          </button>

          <button className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 transition font-semibold">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-10 items-center px-8 lg:px-20 py-16">
        <div>
          <h2 className="text-5xl lg:text-7xl font-extrabold leading-tight">
            Match With
            <span className="text-pink-500"> Developers </span>
            Around You.
          </h2>

          <p className="mt-6 text-zinc-400 text-lg max-w-xl leading-8">
            DevTinder helps developers connect, collaborate, and build amazing
            projects together using modern technologies.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 transition font-semibold shadow-lg">
              Get Started
            </button>

            <button className="px-6 py-3 rounded-2xl border border-zinc-700 hover:bg-zinc-900 transition">
              Explore Developers
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="flex justify-center">
          <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl w-[340px] border border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
              alt="developer"
              className="h-[420px] w-full object-cover"
            />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Dhruval</h3>
                  <p className="text-zinc-400">Full Stack Developer</p>
                </div>

                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  Online
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {['React', 'Node.js', 'MongoDB', 'JWT'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-zinc-800 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-5 mt-8">
                <button className="w-16 h-16 rounded-full bg-red-500/20 text-3xl hover:scale-105 transition">
                  ❌
                </button>

                <button className="w-16 h-16 rounded-full bg-green-500/20 text-3xl hover:scale-105 transition">
                  ❤️
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Cards */}
      <section className="px-8 lg:px-20 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold">Popular Developers</h2>
          <button className="text-pink-500 font-semibold hover:underline">
            View All
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.name}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:scale-[1.02] transition"
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="h-72 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-2xl font-bold">{profile.name}</h3>
                <p className="text-zinc-400 mt-1">{profile.role}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 transition font-semibold">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16 px-8 lg:px-20 py-8 text-zinc-500 flex flex-col lg:flex-row items-center justify-between gap-4">
        <p>© 2026 DevTinder. All rights reserved.</p>

        <div className="flex gap-5">
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  );
}
