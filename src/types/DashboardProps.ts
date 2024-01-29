import User from './User';

interface DashboardProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default DashboardProps;