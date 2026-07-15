import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUsers, HiOutlineGlobeAlt, HiOutlineHeart } from 'react-icons/hi';

const values = [
  { icon: HiOutlineUsers, title: 'People first', desc: 'Every feature starts from a candidate or employer story, not a spreadsheet.' },
  { icon: HiOutlineGlobeAlt, title: 'Open access', desc: 'We aggregate public listings so no opportunity gets missed.' },
  { icon: HiOutlineHeart, title: 'Built to be trusted', desc: 'Verified companies, transparent statuses, no dark patterns.' },
];



const About = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <span className="badge mb-4">Our story</span>
      <h1 className="font-display text-4xl font-bold">We built the job board we wished existed.</h1>
      <p className="mt-5 max-w-2xl text-lg text-ink/60 dark:text-paper/60">
        Jobnix started as a side project to fix one thing: job searching shouldn't feel like shouting into a void.
        Every application on the platform moves through a visible pipeline, so candidates always know where they stand
        and employers always know who's serious.
      </p>
    </motion.div>

    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {values.map((v) => (
        <div key={v.title} className="card p-6">
          <v.icon className="mb-3 text-2xl text-primary-500" />
          <h3 className="font-display font-semibold">{v.title}</h3>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{v.desc}</p>
        </div>
      ))}
    </div>

    <div className="mt-14 card grid grid-cols-2 gap-6 p-8 sm:grid-cols-4">
      {[
        ['2022', 'Founded'],
        ['58k+', 'Candidates hired'],
        ['3.2k+', 'Companies'],
        ['24/7', 'Job aggregation'],
      ].map(([value, label]) => (
        <div key={label} className="text-center">
          <p className="font-display text-2xl font-bold text-primary-500">{value}</p>
          <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default About;
