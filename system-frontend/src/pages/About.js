import React from 'react';
import { FaGithub, FaLinkedin, FaGlobeAfrica, FaHeart } from 'react-icons/fa';

const team = [
  {
    name: 'Sisekelo Preach Masombuka',
    role: 'Full‑Stack Developer',
    bio: 'Focus on backend APIs, authentication, and deployment. Passionate about scalable architectures and great DX.',
    github: 'https://github.com/Sisekelo-Masombuka',
    linkedin: 'https://www.linkedin.com/in/sisekelo-preach-masombuka-4793902bb/'
  },
  {
    name: 'Mpendulo Duma',
    role: 'Full‑Stack Developer',
    bio: 'Works across frontend and backend, integrations, and quality assurance. Enjoys clean code and tests.',
    github: 'https://github.com/Thee-IT-Guy',
    linkedin: 'https://www.linkedin.com/in/mpendulodumapentester/'
  },
  {
    name: 'Luyanda Khomo',
    role: 'Frontend & Design',
    bio: 'Leads UI/UX and component design. Crafts delightful interfaces with attention to detail and accessibility.',
  },
  {
    name: 'Nomcebo Nkosi',
    role: 'Full‑Stack Developer',
    bio: 'Builds features end‑to‑end with a focus on performance, reliability, and great user experience.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-4 text-red-100 max-w-3xl">
            We are a passionate team building Mzansi Moments Hub — a platform to discover and book amazing events across South Africa.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To make event discovery and booking effortless while empowering organizers with modern tools. We focus on
                performance, security, and a seamless ticketing experience — from browsing events, secure checkout, to
                digital tickets with QR codes.
              </p>
              <div className="mt-6 flex items-center text-red-600 font-semibold"><FaGlobeAfrica className="mr-2"/> Proudly built in South Africa</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What we value</h3>
              <ul className="space-y-3 text-gray-700 list-disc pl-5">
                <li>Great user experiences and accessibility</li>
                <li>Robust engineering and maintainable code</li>
                <li>Security-first design and privacy</li>
                <li>Continuous improvement and teamwork</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xl mb-4">
                  {member.name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                </div>
                <div className="text-lg font-semibold text-gray-900">{member.name}</div>
                <div className="text-sm text-red-600 font-medium mt-1">{member.role}</div>
                <p className="text-sm text-gray-600 mt-3">{member.bio}</p>
                <div className="flex items-center gap-4 mt-4 text-gray-400">
                  {member.github ? (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`} className="hover:text-gray-600">
                      <FaGithub />
                    </a>
                  ) : (
                    <FaGithub className="opacity-40" />
                  )}
                  {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`} className="hover:text-gray-600">
                      <FaLinkedin />
                    </a>
                  ) : (
                    <FaLinkedin className="opacity-40" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center text-gray-600"><FaHeart className="text-red-600 mr-2"/> Thank you for supporting local tech!</div>
        </div>
      </section>
    </div>
  );
}
