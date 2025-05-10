import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
const Register = () => {
  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form action="" className="flex flex-col gap-6 max-w-xl w-full px-8">
        <div className="flex flex-col gap-2">
          <label>Email</label>
          <Input type="email" name="email" placeholder="Enter email" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <Input type="password" name="password" placeholder="Enter Password" />
        </div>
        <Button>Register</Button>
        <span className="text-[#63657b] text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
