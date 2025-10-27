
import React from 'react';
import Container from './Container';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <Container>
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} TicketApp. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
