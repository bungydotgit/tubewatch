# 🎬 TubeWatch

> Watch YouTube videos together in real-time with your friends

A synchronized video watch party web application that lets you watch YouTube videos with friends, no matter where they are. Experience videos together with real-time playback synchronization, shared controls, and interactive chat.

[![Work in Progress](https://img.shields.io/badge/status-work%20in%20progress-yellow)](https://github.com/bungydotgit/tubewatch)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🎥 **Synchronized Playback** - Watch videos in perfect sync with all participants
- 🎮 **Shared Controls** - Host can control playback for everyone in the room
- 💬 **Real-time Chat** - Discuss the video as you watch together
- 🔗 **Easy Room Creation** - Create or join rooms with a simple link
- 🌐 **Multi-platform Support** - Works on desktop and mobile browsers
- ⚡ **Fast & Responsive** - Built with modern web technologies

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **Video Player**: React Player
- **State Management**: Zustand
- **Real-time Communication**: WebSockets

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/bungydotgit/tubewatch.git
cd tubewatch
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables

Create a `.env` file in the server directory:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the client directory:
```env
VITE_SERVER_URL=http://localhost:3001
```

4. Start the development servers

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📖 Usage

1. **Create a Room**: Click "Create Room" to start a new watch party
2. **Share the Link**: Copy the room URL and share it with friends
3. **Add a Video**: Paste a YouTube URL to load the video
4. **Watch Together**: The host controls playback for all participants
5. **Chat**: Use the built-in chat to discuss the video in real-time

## 🗺️ Roadmap

- [x] Basic room creation and joining
- [x] Real-time video synchronization
- [x] Host controls
- [ ] Enhanced chat features (emojis, reactions)
- [x] User authentication
- [ ] Playlist support
- [ ] Watch history
- [ ] Mobile app (React Native)
- [ ] Support for other video platforms (Vimeo, Twitch, etc.)

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or suggestions, your help is appreciated.

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tubewatch.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m "Add: amazing new feature"
   ```

   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Docs:` for documentation changes
   - `Refactor:` for code refactoring

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

### Development Guidelines

- **Code Style**: Follow TypeScript and ESLint conventions
- **Testing**: Test your changes in both development and production builds
- **Documentation**: Update documentation for any new features or changes
- **Commits**: Write clear, concise commit messages
- **Issues**: Check existing issues before creating new ones

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- ♿ Accessibility improvements
- 🌍 Internationalization

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (browser, OS, etc.)

## 💡 Feature Requests

Have an idea? Open an issue with:
- Clear description of the feature
- Use cases
- Why it would be valuable
- Any implementation suggestions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **bungydotgit** - [GitHub](https://github.com/bungydotgit)

## 🙏 Acknowledgments

- React Player for video playback
- Socket.io for real-time communication
- All contributors who help improve this project

## 📞 Contact

Have questions? Feel free to:
- Open an issue
- Reach out on GitHub

---

**Note**: This project is currently under active development. Features may change, and some functionality might be incomplete. Feel free to contribute or report issues!

⭐ Star this repo if you find it useful!
