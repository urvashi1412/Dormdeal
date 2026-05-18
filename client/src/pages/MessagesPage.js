import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

let socket;

export default function MessagesPage() {
  const { roomId: paramRoomId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeRoom, setActiveRoom] = useState(paramRoomId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [receiver, setReceiver] = useState(location.state?.receiver || null);
  const [activeListing, setActiveListing] = useState(location.state?.listing || null);
  const bottomRef = useRef(null);

  // Connect socket once
  useEffect(() => {
    socket = io('http://localhost:5000');
    return () => socket.disconnect();
  }, []);

  // Load threads
  useEffect(() => {
    axios.get('/api/messages/conversations')
      .then(r => setThreads(r.data))
      .catch(() => {});
  }, []);

  // When room changes — load messages and join socket room
  useEffect(() => {
    if (!activeRoom) return;
    axios.get(`/api/messages/${activeRoom}`)
      .then(r => setMessages(r.data))
      .catch(() => toast.error('Could not load messages'));
    socket.emit('join_room', activeRoom);
  }, [activeRoom]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.roomId === activeRoom) setMessages(prev => [...prev, msg]);
    };
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [activeRoom]);

  // Auto-scroll
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
        body
      });
      socket.emit('send_message', { ...data, roomId: activeRoom });
      setMessages(prev => [...prev, data]);
    } catch { toast.error('Could not send message'); }
  };

  const openThread = (thread) => {
    const other = thread.sender._id === user._id ? thread.receiver : thread.sender;
    setReceiver(other);
    setActiveListing(thread.listing);
    setActiveRoom(thread.roomId);
  };

  const otherName = receiver?.name || 'Select a conversation';
  const initials  = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <div className="messages-layout">

        {/* Thread list */}
        <div className="threads-list">
          {threads.length === 0 && (
            <p style={{ padding:20, color:'var(--muted)', fontSize:14 }}>No conversations yet</p>
          )}
          {threads.map(t => {
            const other = t.sender._id === user._id ? t.receiver : t.sender;
            return (
              <div key={t._id} className={`thread-item ${activeRoom === t.roomId ? 'active' : ''}`}
                onClick={() => openThread(t)}>
                <div className="thread-avatar">{initials(other.name)}</div>
                <div style={{ minWidth:0 }}>
                  <div className="thread-name">{other.name}</div>
                  {t.listing && <div style={{ fontSize:12, color:'var(--muted)', marginBottom:2 }}>{t.listing.title}</div>}
                  <div className="thread-preview">{t.body}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="chat-area">
          <div className="chat-header">
            {activeRoom ? (
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div className="thread-avatar" style={{ width:36, height:36, fontSize:14 }}>
                  {initials(otherName)}
                </div>
                <div>
                  <div>{otherName}</div>
                  {activeListing && (
                    <div style={{ fontSize:12, color:'var(--muted)' }}>
                      Re: {activeListing.title} — ${activeListing.price}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span style={{ color:'var(--muted)' }}>No conversation selected</span>
            )}
          </div>

          <div className="chat-messages">
            {!activeRoom && (
              <p style={{ textAlign:'center', color:'var(--muted)', marginTop:40 }}>
                Pick a conversation or message a seller from a listing page
              </p>
            )}
            {messages.map(m => (
              <div key={m._id} className={`msg ${m.sender._id === user._id ? 'msg-mine' : 'msg-theirs'}`}>
                {m.body}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {activeRoom && (
            <form onSubmit={sendMessage} className="chat-input-row">
              <input value={text} onChange={e => setText(e.target.value)}
                placeholder="Type a message…" autoFocus />
              <button type="submit" className="btn btn-primary btn-sm">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
