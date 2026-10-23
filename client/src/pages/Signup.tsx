// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2, CheckCircle, ArrowRight, User, Lock, Mail } from 'lucide-react';
// import axios from 'axios';

// nodejs old

// export const Signup = () => {
//     const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
//     const [email, setEmail] = useState('');
//     const [otp, setOtp] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [setupToken, setSetupToken] = useState('');

//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     // Step 1: Send OTP
//     const handleEmailSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             await axios.post(`${import.meta.env.VITE_API_URL || ''}/auth/signup-step1`, { email });
//             setStep('otp');
//         } catch (err: any) {
//             setError(err.response?.data?.detail || 'Failed to send OTP');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Step 2: Verify OTP
//     const handleOtpSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/auth/signup-step2`, { email, otp });
//             setSetupToken(res.data.setup_token);
//             setStep('details');
//         } catch (err: any) {
//             setError(err.response?.data?.detail || 'Invalid OTP');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Step 3: Set Username & Password
//     const handleDetailsSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/auth/signup-step3`, {
//                 setup_token: setupToken,
//                 username,
//                 password
//             });

//             login(res.data.access_token);
//             navigate('/');
//         } catch (err: any) {
//             setError(err.response?.data?.detail || 'Failed to create account');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="glass-card p-8 w-full max-w-md relative overflow-hidden holographic-border"
//             >
//                 <AnimatePresence mode="wait">
//                     {/* Step 1: Email */}
//                     {step === 'email' && (
//                         <motion.div
//                             key="email"
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                         >
//                             <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
//                             <p className="text-dark-muted text-center mb-6">Enter your email to get started</p>

//                             {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

//                             <form onSubmit={handleEmailSubmit} className="space-y-4">
//                                 <div className="relative">
//                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />
//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         placeholder="Email Address"
//                                         className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
//                                         required
//                                     />
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     disabled={isLoading}
//                                     className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                                 >
//                                     {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
//                                 </button>
//                             </form>
//                             <div className="mt-6 text-center text-dark-muted text-sm">
//                                 Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Log in</Link>
//                             </div>
//                         </motion.div>
//                     )}

//                     {/* Step 2: OTP */}
//                     {step === 'otp' && (
//                         <motion.div
//                             key="otp"
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -20 }}
//                         >
//                             <h2 className="text-3xl font-bold text-white mb-2 text-center">Verify Email</h2>
//                             <p className="text-dark-muted text-center mb-6">Enter the code sent to {email}</p>

//                             {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

//                             <form onSubmit={handleOtpSubmit} className="space-y-4">
//                                 <input
//                                     type="text"
//                                     value={otp}
//                                     onChange={(e) => setOtp(e.target.value)}
//                                     placeholder="000000"
//                                     className="w-full bg-dark-input/50 border border-white/10 rounded-xl p-3 text-white text-center text-2xl tracking-widest focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
//                                     maxLength={6}
//                                     required
//                                 />
//                                 <button
//                                     type="submit"
//                                     disabled={isLoading}
//                                     className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                                 >
//                                     {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify Code'}
//                                 </button>
//                             </form>
//                             <button onClick={() => setStep('email')} className="w-full mt-4 text-dark-muted text-sm hover:text-white">Back to Email</button>
//                         </motion.div>
//                     )}

//                     {/* Step 3: Details */}
//                     {step === 'details' && (
//                         <motion.div
//                             key="details"
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -20 }}
//                         >
//                             <h2 className="text-3xl font-bold text-white mb-2 text-center">Final Step</h2>
//                             <p className="text-dark-muted text-center mb-6">Choose your username and password</p>

//                             {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

//                             <form onSubmit={handleDetailsSubmit} className="space-y-4">
//                                 <div className="relative">
//                                     <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />
//                                     <input
//                                         type="text"
//                                         value={username}
//                                         onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
//                                         placeholder="Username"
//                                         className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
//                                         required
//                                         minLength={3}
//                                     />
//                                 </div>
//                                 <div className="relative">
//                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />
//                                     <input
//                                         type="password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         placeholder="Password"
//                                         className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
//                                         required
//                                         minLength={6}
//                                     />
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     disabled={isLoading}
//                                     className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                                 >
//                                     {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Complete Signup <CheckCircle className="w-5 h-5" /></>}
//                                 </button>
//                             </form>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </motion.div>
//         </div>
//     );
// };

// java 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, User, Lock, Mail } from 'lucide-react';
import axios from 'axios';

const JAVA_API_URL =
    import.meta.env.VITE_JAVA_API_URL || 'http://localhost:8080';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 12) {
            setError('Password must contain at least 12 characters.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                `${JAVA_API_URL} /api/auth / signup`,
                {
                    email: email.trim(),
                    password,
                }
            );

            setSuccess(
                response.data?.message || 'Account created successfully!'
            );

            // Signup does not automatically log the user in.
            // Redirect to the Java login page after success.
            setTimeout(() => navigate('/login'), 1200);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError('An account with this email already exists.');
                } else if (err.response?.status === 400) {
                    setError(
                        err.response.data?.message ||
                        'Please check your email and password.'
                    );
                } else if (!err.response) {
                    setError(
                        'Cannot connect to Java server. Check that it is running on port 8080.'
                    );
                } else {
                    setError(
                        err.response.data?.message ||
                        err.response.data?.detail ||
                        'Failed to create account. Please try again.'
                    );
                }
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 w-full max-w-md relative overflow-hidden holographic-border"
            >
                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                    Create Account
                </h2>

                <p className="text-dark-muted text-center mb-6">
                    Register with your email and password
                </p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            autoComplete="email"
                            className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                            required
                        />
                    </div>

                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />

                        <input
                            type="text"
                            value={email.split('@')[0]}
                            readOnly
                            aria-label="Username preview"
                            placeholder="Username preview"
                            className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-dark-muted outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password (minimum 12 characters)"
                            autoComplete="new-password"
                            minLength={12}
                            maxLength={72}
                            className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            minLength={12}
                            maxLength={72}
                            className="w-full bg-dark-input/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !!success}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                Create Account
                                <CheckCircle className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-dark-muted text-sm">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary-400 hover:text-primary-300 font-medium"
                    >
                        Log in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
