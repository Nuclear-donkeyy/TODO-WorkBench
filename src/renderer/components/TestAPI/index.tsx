import React, { useState } from 'react';
import { Button } from '../../design-system/components';

const TestAPIComponent: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // 使用 preload.ts 中暴露的 API
    if (window.testAPI) {
      window.testAPI.testAPI(message);
      console.log('Message sent to main process:', message);
    } else {
      console.error('testAPI is not available');
    }
  };

  return (
    <div>
      <h3>Test API Component</h3>
      <input
        type='text'
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder='Enter a message'
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <Button onClick={handleSendMessage}>Send to Main Process</Button>
    </div>
  );
};

export default TestAPIComponent;
