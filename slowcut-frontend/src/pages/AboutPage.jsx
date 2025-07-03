import React from 'react';

const AboutPage = () => {
  return (
    <div className='px-3 md:px-0 md:w-3/4 md:mx-auto text-white space-y-4'>
      <div className='text-2xl font-bold text-center mt-3'>About</div>

      {/* Introduction */}
      <div>
        <div className='text-xl font-semibold'>Introduction</div>
        <p>
          Welcome to <strong>SlowCut</strong>, a social movie tracking and discovery app for film lovers.
          This full-stack application is built using the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js).
          All movie data is fetched in real time from <a className='text-blue-500 hover:underline' href="https://www.themoviedb.org/" target='_blank' rel="noopener noreferrer">TMDB</a>.
        </p>
      </div>

      {/* Backend Features */}
      <div>
        <div className='text-xl font-semibold'>Backend Features</div>
        <ul className='list-disc pl-5'>
          <li>Authentication with JWT, secure password hashing</li>
          <li>Profile creation and editing with avatar upload</li>
          <li>Follow/unfollow users and see their movie activity</li>
          <li>Creating public/private film lists (ranked or unranked)</li>
          <li>Logging watched movies, liking and commenting on lists</li>
          <li>Writing and viewing reviews for any movie</li>
          <li>Trending lists and reviews based on engagement (likes/comments)</li>
          <li>Activity feed showing likes, follows, comments and more</li>
        </ul>
      </div>

      {/* Frontend Features */}
      <div>
        <div className='text-xl font-semibold'>Frontend</div>
        <ul className='list-disc pl-5'>
          <li>Responsive design using <strong>React</strong> and <strong>Tailwind CSS</strong></li>
          <li>React Router for seamless client-side routing</li>
          <li>Dynamic movie and user pages</li>
          <li>Optimistic UI updates with loading states and transitions</li>
        </ul>
      </div>

      {/* AI Integration */}
      <div>
        <div className='text-xl font-semibold'>AI Integration</div>
        <ul className='list-disc pl-5'>
          <li>AI-powered movie news and summaries using <strong>Gemini API</strong></li>
          <li>Contextual movie recommendations based on user's watch history</li>
          <li>Trending film insights with natural language explanations</li>
        </ul>
      </div>

      {/* Hosting / Deployment */}
      <div>
        <div className='text-xl font-semibold'>Hosting / Deployment</div>
        <ul className='list-disc pl-5'>
          <li>Backend deployed using <strong>Render</strong> or <strong>Railway</strong> (or another free Node.js hosting)</li>
          <li>Frontend hosted on <strong>Vercel</strong></li>
          <li>Images stored via <strong>Cloudinary</strong></li>
          <li>MongoDB Atlas used for database hosting</li>
        </ul>
      </div>

      {/* GitHub */}
      <div>
        <p>
          For full source code and contributions, check out the <a className='text-blue-500 hover:underline' href="https://github.com/arriagada689/letterboxd-clone" target='_blank' rel="noopener noreferrer">project GitHub page</a>.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
