const countRoomConnections = (io, room_name) => {
  const roomSockets = io.sockets.adapter.rooms.get(room_name);
  const connectionCount = roomSockets ? roomSockets.size : 0;

  return connectionCount;
};

export { countRoomConnections };
