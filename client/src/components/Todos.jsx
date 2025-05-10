import toast from 'react-hot-toast';
const Todos = () => {
  return (
    <div>
      <button onClick={() => toast.success('button clicked')}>Click me</button>
    </div>
  );
};

export default Todos;
