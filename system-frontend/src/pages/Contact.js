import React from 'react';
import { FaEnvelope, FaPhone, FaInstagram, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';

const team = [
  {
    name: 'Sisekelo Preach Masombuka',
    role: 'Full‑Stack Developer',
    lead: true,
    phone: '079 226 9713',
    email: 'sisekelopreachmasombuka@gmail.com',
    instagram: 'https://www.instagram.com/sisekelo_cuba999',
    github: 'https://github.com/Sisekelo-Masombuka',
    linkedin: 'https://www.linkedin.com/in/sisekelo-preach-masombuka-4793902bb/',
    location: '',
    avatar: ''
  },
  {
    name: 'Mpendulo Duma',
    role: 'Full‑Stack Developer',
    phone: '', email: '', instagram: '', github: 'https://github.com/Thee-IT-Guy', linkedin: 'https://www.linkedin.com/in/mpendulodumapentester/', location: '', avatar: ''
  },
  { name: 'Luyanda Khomo', role: 'Frontend & Design', phone: '', email: '', instagram: '', github: '', linkedin: '', location: '', avatar: '' },
  { name: 'Nomcebo Nkosi', role: 'Full‑Stack Developer', phone: '', email: '', instagram: '', github: '', linkedin: '', location: '', avatar: '' },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Our Team</h1>
          <p className="text-gray-600 mt-2">Reach out to the developers behind Mzansi Moments Hub.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Developers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-2xl mb-4 overflow-hidden">
                  {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full object-cover"/> : m.name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-gray-900">{m.name}</div>
                </div>
                <div className="text-sm text-red-600 font-medium mt-1">{m.role}</div>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <div className="flex items-center"><FaEnvelope className="text-red-600 mr-2"/> {m.email || 'Email coming soon'}</div>
                  <div className="flex items-center"><FaPhone className="text-red-600 mr-2"/> {m.phone || 'Phone coming soon'}</div>
                  <div className="flex items-center"><FaInstagram className="text-red-600 mr-2"/> {m.instagram ? '@' + (new URL(m.instagram).pathname.replaceAll('/','')) : 'Instagram coming soon'}</div>
                  {m.location && (<div className="flex items-start"><FaMapMarkerAlt className="text-red-600 mr-2 mt-1"/> {m.location}</div>)}
                </div>
                <div className="flex items-center gap-4 mt-4 text-gray-400">
                  {m.instagram && (<a href={m.instagram} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700"><FaInstagram/></a>)}
                  {m.github && (<a href={m.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600"><FaGithub/></a>)}
                  {m.linkedin && (<a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600"><FaLinkedin/></a>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
