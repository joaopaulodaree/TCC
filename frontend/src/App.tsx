import { MainLayout } from './components/layout/MainLayout';
import { ChatWindow } from './components/chat/ChatWindow';
import './styles/App.css';

function App() {
  return (
    <MainLayout>
      <ChatWindow />
    </MainLayout>
  );
}

export default App;