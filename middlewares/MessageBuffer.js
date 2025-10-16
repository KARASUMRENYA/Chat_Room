// BACKEND/middlewares/messageBuffer.js
const messageBuffer = [];
const FLUSH_INTERVAL = 5000; // 5 seconds
const BATCH_LIMIT = 50;      // flush if >50 messages

// Function to add message to buffer
function addMessage(messageData) {
  messageBuffer.push(messageData);
}

// Function to flush messages (insert into DB later)
async function flushMessages(insertToDB) {
  if (messageBuffer.length === 0) return;

  const messagesToInsert = [...messageBuffer];
  messageBuffer.length = 0;

  try {
    await insertToDB(messagesToInsert);
    console.log(` Flushed ${messagesToInsert.length} messages to DB.`);
  } catch (err) {
    console.error("Error flushing messages:", err);
    // if DB fails, requeue
    messageBuffer.unshift(...messagesToInsert);
  }
}

// Function to start auto-flushing at intervals
function startBuffering(insertToDB) {
  setInterval(() => {
    if (messageBuffer.length >= BATCH_LIMIT || messageBuffer.length > 0) {
      flushMessages(insertToDB);
    }
  }, FLUSH_INTERVAL);
}

module.exports = { addMessage, startBuffering };
