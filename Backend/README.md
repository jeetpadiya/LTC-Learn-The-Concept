# LTC (Learn The Concept) - C++ DSA Backend

High-performance C++ backend powered by [Crow](https://crowcpp.org) and standalone [Asio](https://think-async.com/Asio/). It computes step-by-step execution traces for Data Structures and Algorithms (DSA) and streams them to the LTC 3D Next.js frontend via REST and WebSockets.

---

## Directory Structure

```text
Backend/
├── CMakeLists.txt              # CMake configuration (C++17, pthread, target: ltc_server)
├── build.sh                    # One-command build script
├── run.sh                      # One-command launch script
├── include/
│   ├── crow/
│   │   └── crow_all.h          # Crow single-header web framework
│   └── algorithms/
│       └── sort_engine.hpp     # DSA execution trace generators (Bubble, Selection, Insertion, Quick)
├── src/
│   └── main.cpp                # Crow server, REST endpoints, CORS middleware, WebSocket streaming
└── third_party/
    └── asio/                   # Standalone header-only Asio networking library
```

---

## API Endpoints

### 1. Health Check
- **Route**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "engine": "LTC (Learn The Concept) C++ Engine",
  "version": "1.0.0"
}
```

### 2. Available Algorithms
- **Route**: `GET /api/algorithms`
- **Response**:
```json
{
  "algorithms": ["bubble", "selection", "insertion", "quick"]
}
```

### 3. Generate Execution Trace (REST)
- **Route**: `POST /api/sort/<algo>` (e.g., `/api/sort/bubble`, `/api/sort/quick`)
- **Headers**: `Content-Type: application/json`
- **Payload**:
```json
{
  "array": [45, 22, 89, 34, 67, 12, 78, 56, 90, 29]
}
```

### 4. Real-time WebSocket Streaming
- **Route**: `ws://localhost:18080/ws/sort`

---

## Building and Running

### Build:
```bash
./build.sh
```

### Run:
```bash
./run.sh          # Default: port 18080
./run.sh 8080     # Or custom port
```
