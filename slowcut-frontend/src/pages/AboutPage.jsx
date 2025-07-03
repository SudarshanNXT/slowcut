import React from 'react';

const AboutPage = () => {
  return (
    <div className='px-3 md:px-0 md:w-3/4 md:mx-auto text-white space-y-4'>
      <div className='text-2xl font-bold text-center mt-3'>About</div>

      {/* Introduction */}
      <div>
        <div className='text-xl font-semibold'>Introduction</div>
        <p>
          Welcome to <strong>SlowCut</strong> — a social movie tracking and discovery app built for passionate film lovers.
          This full-stack web application is developed using the <strong>MERN stack</strong> (MongoDB, Express.js, React, Node.js).
          All movie data is fetched in real time from <a className='text-blue-500 hover:underline' href="https://www.themoviedb.org/" target='_blank' rel="noopener noreferrer">TMDB</a>.
        </p>
      </div>

      {/* Backend Features */}
      <div>
        <div className='text-xl font-semibold'>Backend Features</div>
        <ul className='list-disc pl-5'>
          <li>JWT-based authentication with secure password hashing</li>
          <li>Custom user profiles with editable bios and avatars</li>
          <li>Follow and unfollow other users</li>
          <li>Create ranked/unranked public and private movie lists</li>
          <li>Track watched films with diary-style logging</li>
          <li>Write and view reviews with engagement stats</li>
          <li>Like and comment on others' lists</li>
          <li>See real-time activity feed (likes, comments, follows)</li>
        </ul>
      </div>

      {/* Frontend Features */}
      <div>
        <div className='text-xl font-semibold'>Frontend</div>
        <ul className='list-disc pl-5'>
          <li>Built with <strong>React</strong> and styled using <strong>Tailwind CSS</strong></li>
          <li>Client-side routing with React Router</li>
          <li>Modular component structure and responsive design</li>
          <li>Dynamic movie, list, and profile pages</li>
          <li>Smooth UI transitions and loading states</li>
        </ul>
      </div>

      {/* AI Integration */}
      <div>
        <div className='text-xl font-semibold'>AI Integration</div>
        <ul className='list-disc pl-5'>
          <li>Movie news summaries powered by <strong>Gemini API</strong></li>
          <li>Context-aware movie recommendations based on user data</li>
          <li>Trending films analysis using natural language AI</li>
        </ul>
      </div>

      {/* Hosting / Deployment */}
      <div>
        <div className='text-xl font-semibold'>Hosting & Deployment</div>
        <ul className='list-disc pl-5'>
          <li>Backend hosted on <strong>Render</strong></li>
          <li>Frontend deployed via <strong>Vercel</strong></li>
          <li>MongoDB hosted with <strong>MongoDB Atlas</strong></li>
          <li>No image hosting used currently (Cloudinary not integrated)</li>
        </ul>
      </div>

      {/* GitHub */}
      <div>
        <p>
          For full source code and contributions, visit the{' '}
          <a
            className='text-blue-500 hover:underline'
            href='https://github.com/SudarshanNXT/slowcut'
            target='_blank'
            rel='noopener noreferrer'
          >
            GitHub repository
          </a>.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
