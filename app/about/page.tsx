'use client';

import Link from 'next/link';
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  Sparkles, 
  Bell, 
  Upload, 
  Share2, 
  Clock,
  Home,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dependa</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              The Calendar for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Overthinkers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Dependa is a conditional calendar application that helps you plan for multiple futures. 
              Perfect for managing tasks that depend on uncertain events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Get Started Free
                </Link>
              )}
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop"
              alt="Calendar and planning workspace"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Planning
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage complex, conditional task flows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Conditional Events
              </h3>
              <p className="text-gray-700">
                Create &quot;if-then&quot; scenarios that automatically trigger tasks when conditions are met. 
                Perfect for planning multiple possible futures.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Todo Lists
              </h3>
              <p className="text-gray-700">
                Organize tasks with due dates, assignments, and completion tracking. 
                Upload proof of completion with images or documents.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Calendar Sharing
              </h3>
              <p className="text-gray-700">
                Collaborate with team members by sharing calendars. 
                Assign tasks to specific users and track completion together.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Daily Reminders
              </h3>
              <p className="text-gray-700">
                Receive email reminders every morning at 9 AM with your assigned tasks. 
                Stay on top of your responsibilities effortlessly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Proof of Completion
              </h3>
              <p className="text-gray-700">
                Upload photos, PDFs, and documents as proof of task completion. 
                Keep a visual record of your progress.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Google Calendar Sync
              </h3>
              <p className="text-gray-700">
                Seamlessly sync your events with Google Calendar. 
                Keep all your schedules in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conditional Events Deep Dive */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                alt="Planning and strategy"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2 text-white">
              <h2 className="text-4xl font-bold mb-6">
                Plan for Multiple Futures
              </h2>
              <p className="text-lg mb-6 text-blue-100">
                The standout feature of Dependa is conditional events. Create tasks that only appear 
                when certain conditions are met.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Set a Trigger Date</h4>
                    <p className="text-blue-100">Define when the condition should be checked</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Add Multiple Tasks</h4>
                    <p className="text-blue-100">Create all the tasks that should trigger</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Automatic Activation</h4>
                    <p className="text-blue-100">Tasks appear automatically when the date arrives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect For Any Scenario
            </h2>
            <p className="text-xl text-gray-600">
              Whether personal or professional, Dependa adapts to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Use Case 1 */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop"
                alt="Moving house"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Moving & Real Estate</h3>
                  <p className="text-gray-200">
                    &quot;If house sells on Nov 15, then plan estate sale, hire movers, update addresses...&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop"
                alt="Team collaboration"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Project Management</h3>
                  <p className="text-gray-200">
                    &quot;If project approved, then assign tasks, schedule meetings, order supplies...&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&fit=crop"
                alt="Wedding planning"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Event Planning</h3>
                  <p className="text-gray-200">
                    &quot;If venue confirmed, then send invitations, arrange catering, book photographer...&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Use Case 4 */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop"
                alt="Business planning"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Legal & Business</h3>
                  <p className="text-gray-200">
                    &quot;If contract signed, then file paperwork, notify stakeholders, begin onboarding...&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for Collaboration
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Share calendars with your team, family, or colleagues. Assign tasks to specific people 
                and track progress together in real-time.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Invitations</h4>
                    <p className="text-gray-600">Send invites directly from the app</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Task Assignment</h4>
                    <p className="text-gray-600">Assign specific tasks to team members</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Permission Control</h4>
                    <p className="text-gray-600">Set view or edit permissions per user</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Plan Smarter?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Dependa today and take control of your conditional future. It&apos;s free to get started.
          </p>
          {!user ? (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Sign Up with Google
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Go to Your Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Dependa</h3>
              </div>
              <p className="text-gray-400">
                The conditional calendar for overthinkers. Plan for multiple futures with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                {user ? (
                  <li>
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Conditional Events</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Smart Todos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Team Collaboration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Daily Reminders</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Dependa. Built with Next.js and Firebase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


