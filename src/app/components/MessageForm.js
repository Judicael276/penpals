import { useState } from 'react';
import { uploadMedia, sendMessage } from '../lib/path-to-functions'; // Mettez le bon chemin vers les fonctions

export default function MessageForm({ senderId, receiverId }) {
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    let mediaUrl = null;

    if (media) {
      mediaUrl = await uploadMedia(media);
    }

    await sendMessage(senderId, receiverId, text, mediaUrl, mediaType);
    setText('');
    setMedia(null);
    setMediaType('');
  };

  return (
    <form onSubmit={handleSendMessage}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        rows="4"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <button type="submit">Send</button>
    </form>
  );
}
