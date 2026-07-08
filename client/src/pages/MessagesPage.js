import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import EmptyState, { EmptyIllustration } from '../components/ui/EmptyState';

let socket;

export default function MessagesPage() {
  const { roomId: paramRoomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [threadSearch, setThreadSearch] = useState('');
  const [activeRoom, setActiveRoom] = useState(paramRoomId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [receiver, setReceiver] = useState(location.state?.receiver || null);
  const [activeListing, setActiveListing] = useState(location.state?.listing || null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket = io('http://localhost:5000');
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    axios.get('/api/messages/conversations')
      .then(r => setThreads(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!threadSearch.trim()) {
      setFilteredThreads(threads);
      return;
    }
    const q = threadSearch.toLowerCase();
    setFilteredThreads(
      threads.filter(t => {
        const other = t.sender._id === user._id ? t.receiver : t.sender;
        return (
          other.name?.toLowerCase().includes(q) ||
          t.listing?.title?.toLowerCase().includes(q) ||
          t.body?.toLowerCase().includes(q)
        );
      })
    );
  }, [threads, threadSearch, user._id]);

  useEffect(() => {
    if (paramRoomId) setActiveRoom(paramRoomId);
  }, [paramRoomId]);

  useEffect(() => {
    if (!activeRoom) return;
    axios.get(`/api/messages/${activeRoom}`)
      .then(r => setMessages(r.data))
      .catch(() => toast.error('Could not load messages'));
    socket.emit('join_room', activeRoom);
  }, [activeRoom]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.roomId === activeRoom) setMessages(prev => [...prev, msg]);
    };
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !receiver) return;
    const body = text.trim();
    setText('');
    try {
      const { data } = await axios.post('/api/messages', {
        roomId: activeRoom,
        listingId: activeListing?._id,
        receiverId: receiver._id,
        body,
      });
      socket.emit('send_message', { ...data, roomId: activeRoom });
      setMessages(prev => [...prev, data]);
    } catch {
      toast.error('Could not send message');
    }
  };

  const openThread = (thread) => {
    const other = thread.sender._id === user._id ? thread.receiver : thread.sender;
    setReceiver(other);
    setActiveListing(thread.listing);
    setActiveRoom(thread.roomId);
  };

  const otherName = receiver?.name || 'Select a conversation';

  return (
    <div className="dd-messages-page">
      <div className="dd-section-header" style={{ marginBottom: 16 }}>
        <h1 className="dd-section-title">Messages</h1>
      </div>

      <div className={`dd-messages-layout ${activeRoom ? 'has-thread' : ''}`}>
        <div className="dd-threads">
          <div className="dd-threads__search">
            <div className="dd-search-bar" style={{ marginBottom: 0 }}>
              <Search size={16} className="dd-search-bar__icon" />
              <input
                className="dd-search-bar__input"
                style={{ paddingLeft: 38, fontSize: 13 }}
                placeholder="Search conversations…"
                value={threadSearch}
                onChange={e => setThreadSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="dd-threads__list">
            {filteredThreads.length === 0 && (
              <EmptyState
                illustration={<EmptyIllustration type="messages" />}
                title="No conversations"
                description="Message a seller from any listing page."
              />
            )}
            {filteredThreads.map(t => {
              const other = t.sender._id === user._id ? t.receiver : t.sender;
              return (
                <button
                  key={t._id}
                  type="button"
                  className={`dd-thread ${activeRoom === t.roomId ? 'is-active' : ''}`}
                  onClick={() => openThread(t)}
                >
                  <Avatar name={other.name} size="md" />
                  <div className="dd-thread__content">
                    <div className="dd-thread__name">{other.name}</div>
                    {t.listing && <div className="dd-thread__listing">{t.listing.title}</div>}
                    <div className="dd-thread__preview">{t.body}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="dd-chat">
          <div className="dd-chat__header">
            {activeRoom ? (
              <>
                <button
                  type="button"
                  className="dd-icon-btn dd-chat__back"
                  onClick={() => { setActiveRoom(null); navigate('/messages'); }}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>
                <Avatar name={otherName} size="sm" />
                <div className="dd-chat__header-info">
                  <h3>{otherName}</h3>
                  {activeListing && (
                    <p>Re: {activeListing.title} — ${activeListing.price}</p>
                  )}
                </div>
              </>
            ) : (
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>
                Select a conversation to start chatting
              </span>
            )}
          </div>

          <div className="dd-chat__messages">
            {!activeRoom && (
              <EmptyState
                illustration={<EmptyIllustration type="messages" />}
                title="Your inbox"
                description="Pick a conversation or message a seller from a listing."
              />
            )}
            {messages.map(m => (
              <div
                key={m._id}
                className={`dd-msg ${m.sender._id === user._id ? 'dd-msg--mine' : 'dd-msg--theirs'}`}
              >
                {m.body}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {activeRoom && (
            <form onSubmit={sendMessage} className="dd-chat__input">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message…"
                autoFocus
              />
              <button type="submit" className="dd-btn dd-btn--primary dd-btn--sm">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
