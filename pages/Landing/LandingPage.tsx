
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

const WavyBackground: React.FC = () => (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="relative block w-[calc(100%+1.3px)] h-[150px] sm:h-[200px] lg:h-[250px] text-gray-50 dark:text-gray-900">
            <path fill="currentColor" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,245.3C672,267,768,277,864,261.3C960,245,1056,203,1152,170.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
    </div>
);

const DecorCircle: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`absolute rounded-full bg-indigo-200 dark:bg-indigo-800/50 ${className}`}></div>
);


const LandingPage: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <Header />
            <div className="relative bg-indigo-600 dark:bg-indigo-900 overflow-hidden">
                <DecorCircle className="w-48 h-48 -top-20 -left-20" />
                <DecorCircle className="w-72 h-72 top-1/2 -right-36 transform -translate-y-1/2 opacity-50" />
                <Container className="relative z-10">
                    <div className="pt-24 pb-40 sm:pt-32 sm:pb-48 lg:pt-40 lg:pb-56 text-center text-white">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Streamline Your Support
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-indigo-100">
                            TicketApp is the modern, intuitive, and powerful solution for managing customer support tickets. Focus on what matters: happy customers.
                        </p>
                        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/auth/signup" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 sm:px-10">
                                Get Started
                            </Link>
                            <Link to="/auth/login" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 sm:px-10">
                                Login
                            </Link>
                        </div>
                    </div>
                </Container>
                <WavyBackground />
            </div>

            <Container className="py-16 sm:py-24 lg:py-32">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create & Assign</h3>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Easily create new tickets, add details, and assign them to the right team members in seconds.</p>
                     </div>
                     <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Track Progress</h3>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Monitor the status of every ticket from 'open' to 'closed' with our intuitive status tags.</p>
                     </div>
                     <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resolve & Analyze</h3>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Resolve issues efficiently and gain insights from your support data on our dashboard.</p>
                     </div>
                 </div>
            </Container>
            <DecorCircle className="w-96 h-96 -bottom-[400px] -left-48 opacity-30"/>
            <Footer />
        </div>
    );
};

export default LandingPage;
