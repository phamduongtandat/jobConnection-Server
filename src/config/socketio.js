import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { ADMIN_ROOM } from '../constant/socketio.constant.js';
import { User } from '../models/user.model.js';
import { countRoomConnections } from '../services/socketio.service.js';

const client_host = process.env.CLIENT_HOST;
const users = new Map();
const USER_ROOM = 'user room';

const io = new Server({
  cors: {
    origin: client_host,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  const cookie = socket.handshake.headers.cookie;

  if (!cookie) {
    return next(new Error('You need to login'));
  }

  const token = cookie.split('=')[1];

  const { _id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(_id).select('role');

  if (!user) {
    return next(new Error('Can not find user'));
  }

  socket.join(_id);
  if (user.role === 'admin') {
    socket.join(ADMIN_ROOM);
  }

  // if (user.role === 'user') {
  //   socket.join(USER_ROOM);
  // }

  socket.user = {
    _id: user._id,
    role: user.role,
  };

  next();
});

io.on('connection', (socket) => {
  const numberOfOnlineAdmins = countRoomConnections(io, ADMIN_ROOM);

  // emit to all clients except sender
  if (numberOfOnlineAdmins === 1) {
    socket.broadcast.emit('admin_online');
  }

  // emit to current client
  if (numberOfOnlineAdmins > 0) {
    socket.emit('admin_online');
  }

  users.set(socket.user._id, {
    isOnline: true,
    onlineAt: new Date(),
  });

  if (socket.user.role === 'admin') {
    socket.emit('user_list', Object.fromEntries(users.entries()));
  }

  socket.to(ADMIN_ROOM).emit('user_list', Object.fromEntries(users.entries()));

  socket.on('disconnect', () => {
    users.set(socket.user._id, {
      isOnline: false,
      offlineAt: new Date(),
    });

    socket
      .to(ADMIN_ROOM)
      .emit('user_list', Object.fromEntries(users.entries()));

    const numberOfOnlineAdmins = countRoomConnections(io, ADMIN_ROOM);

    if (numberOfOnlineAdmins === 0) {
      io.emit('admin_offline');
    }
  });
});

io.listen(8000);

export { io };
