/**
 * Dev Tools Helper Functions
 *
 * Copy-paste these into Chrome DevTools Console for quick testing
 */

// Reset player (get new ID)
function resetPlayer() {
  localStorage.clear();
  location.reload();
  console.log('✅ Player reset! You will get a new ID on reload.');
}

// Show current player info
function showPlayerInfo() {
  const playerId = localStorage.getItem('playerId');
  const playerName = localStorage.getItem('playerName');

  console.log('📋 Current Player Info:');
  console.log('ID:', playerId || 'Not set');
  console.log('Name:', playerName || 'Not set');

  return { playerId, playerName };
}

// Change player name
function changePlayerName(newName) {
  localStorage.setItem('playerName', newName);
  location.reload();
  console.log(`✅ Name changed to: ${newName}`);
}

// Delete Firebase room
async function deleteRoom(roomCode) {
  const url = `https://tenis-proj-default-rtdb.europe-west1.firebasedatabase.app/rooms/${roomCode}.json`;

  try {
    const response = await fetch(url, { method: 'DELETE' });
    if (response.ok) {
      console.log(`✅ Room ${roomCode} deleted successfully`);
    } else {
      console.error('❌ Failed to delete room');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Get room data from Firebase
async function getRoomData(roomCode) {
  const url = `https://tenis-proj-default-rtdb.europe-west1.firebasedatabase.app/rooms/${roomCode}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      console.log('📦 Room Data:', data);
      console.log('Players:', Object.keys(data.players || {}).length);
      console.log('Teams:', Object.keys(data.teams || {}).length);
      console.log('Status:', data.status);
    } else {
      console.log('❌ Room not found');
    }

    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// List all available functions
function help() {
  console.log(`
🛠️  Dev Tools Helper Functions:

1. resetPlayer()
   - Clear localStorage and reload page
   - Get a new player ID

2. showPlayerInfo()
   - Show current player ID and name

3. changePlayerName(newName)
   - Change your player name
   - Example: changePlayerName("Вася")

4. deleteRoom(roomCode)
   - Delete a room from Firebase
   - Example: deleteRoom("PING-1234")

5. getRoomData(roomCode)
   - Get room data from Firebase
   - Example: getRoomData("PING-1234")

6. help()
   - Show this help message

💡 Quick Tips:
- Open multiple Incognito windows for multi-player testing
- Each Incognito window = separate player
- Use Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
  `);
}

// Auto-run help on load
console.log('🎮 Dev Tools loaded! Type help() to see available commands.');

// Export to window for easy access
window.devTools = {
  resetPlayer,
  showPlayerInfo,
  changePlayerName,
  deleteRoom,
  getRoomData,
  help,
};
