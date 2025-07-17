# Modern 3D Cryptex Puzzle

This project is a modern and realistic 3D cryptex puzzle created with Three.js. It features 5 rotating rings, each displaying the 26 letters of the alphabet.

## ✨ New Features

- **Real 3D Geometry**: Realistic ring shapes using TorusGeometry
- **Advanced Materials**: Metallic appearance with PBR-like properties
- **Extruded Letters**: 3D letters using ExtrudeGeometry
- **Advanced Lighting**: Spot lights, rim lighting and soft shadows
- **Glassmorphism UI**: Modern glass-effect user interface
- **Progress Indicator**: Real-time progress tracking
- **Advanced Animations**: Particle effects, camera shake and ring glow
- **Restricted Camera Controls**: Smart controls preventing excessive rotation

## 🎮 How to Play

1. **Objective**: Rotate the rings to spell "C O D E X"
2. **Controls**:
   - 🖱️ Drag rings with your mouse to rotate them
   - 🔍 Move mouse to control camera (zoom, rotate)
   - ⌨️ Use sliders in the left panel
   - 📊 Track progress with the progress bar in the top right

## 🛠️ Technical Details

### Technologies Used
- **Three.js r128**: 3D graphics library
- **OrbitControls**: Restricted camera controls
- **ExtrudeGeometry**: 3D letter creation
- **TorusGeometry**: Realistic ring shapes
- **SpotLight**: Dramatic lighting effects
- **ParticleSystem**: Particle animations

### Visual Features
- **Tone Mapping**: ACES Filmic tone mapping
- **sRGB Encoding**: Proper color management
- **Soft Shadows**: PCF shadow maps
- **Fog Effect**: Atmospheric depth
- **Glassmorphism**: Modern UI design

### File Structure
```
project/
├── index.html      # Modern glassmorphism UI
├── main.js         # Advanced Three.js application
└── README.md       # This file
```

### Performance Features
- **Hardware Acceleration**: WebGL hardware acceleration
- **Optimized Shadows**: 4096x4096 shadow maps
- **Efficient Geometry**: Optimized 3D models
- **Smooth Animations**: 60fps fluid animations

## 🎨 Visual Effects

### When You Unlock:
1. **Particle Explosion**: 200 colored particles
2. **Ring Glow**: Sequential scale animation
3. **Camera Shake**: Realistic effect
4. **UI Highlight**: Green glow effect

### Continuous Effects:
- **Letter Glow**: Glow with emissive material
- **Shadow Effects**: Realistic light-shadow
- **Metallic Reflection**: PBR-like materials

## 🚀 Installation

1. Upload files to a web server
2. Open `index.html` in your browser
3. Or use a local web server:
   ```bash
   # With Python
   python -m http.server 8000
   
   # With Node.js
   npx serve .
   
   # With PHP
   php -S localhost:8000
   ```

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Note**: WebGL support is required.

## 📱 Responsive Design

- Compatible with all screen sizes
- Optimized for touch devices
- Glassmorphism effects work on all devices

## 🎯 Features

- **5 Rotating Rings**: Each ring can be rotated independently
- **Alphabet Letters**: A-Z letters on each ring
- **Interactive Controls**: Mouse drag and slider controls
- **OrbitControls**: Restricted camera movement
- **Visual Effects**: Advanced particle animations
- **English Interface**: Fully English user interface
- **Progress Tracking**: Real-time code validation

## 🔧 Development

To contribute to the project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

## 📄 License

This project is created for educational purposes and is open source.

---

**Designed for modern 3D experience! 🔐✨🚀** # Cryptex
