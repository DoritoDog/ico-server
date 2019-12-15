var clients = 0;

module.exports = {
  start: (http, port) => {
    http.listen(port, function() {
      console.log(`Socket.io is listening on port ${port}.`);
    });
  },

  run: (io) => {
    io.on('connection', socket => {
      clients++;
      io.emit('update', { clients });
    
      socket.on('message', msg => {
          var values = [[msg.name, msg.profileImage, msg.message]];
          queryDB('INSERT INTO chat_messages (name, image, content) VALUES ?', [values], response => {
    
            io.emit('message', msg);
            queryDB('DELETE FROM chat_messages WHERE id = ?', [response.insertId - 10]);
          });
      });
    
      socket.on('disconnect', function() {
        clients--;
        io.emit('update', { clients });
      });
    });
  }
}