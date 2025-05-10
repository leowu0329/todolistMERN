import { useState, useEffect } from 'react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/userActions';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    success: null,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(formData);
      setState({ success: 'Login successful!', error: null });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setState({ success: null, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 max-w-xl w-full px-8"
      >
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {state.success && (
          <span className="message successMsg">
            {state.success} {'Redirecting...'}
          </span>
        )}
        {state.error && <span className="message errorMsg">{state.error}</span>}
        <Button disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        <span className="text-[#63657b] text-center">
          Don't have an account?{' '}
          <Link
            to="/Register"
            className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline"
          >
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
