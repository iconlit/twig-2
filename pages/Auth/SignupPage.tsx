import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signup(email, password);
            addToast('Signup successful!', 'success');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            addToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <Link to="/" className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 w-fit mx-auto mb-4 group">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                         </svg>
                         Back to Home
                    </Link>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create a new account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Or{' '}
                        <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <Input
                            id="email"
                            label="Email address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                        />
                         <div className="pt-4">
                        <Input
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                         </div>
                         <div className="pt-4">
                        <Input
                            id="confirmPassword"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                        />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;