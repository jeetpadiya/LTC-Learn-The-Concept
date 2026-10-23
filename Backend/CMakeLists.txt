cmake_minimum_required(VERSION 3.16)
project(ltc_backend VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler optimization and warnings
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic -O2)
endif()

# Find Threads library for pthread support
find_package(Threads REQUIRED)

# Include directories
set(BACKEND_INCLUDE_DIRS
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/third_party/asio/include
)

# Executable target
add_executable(ltc_server
    src/main.cpp
)

target_include_directories(ltc_server PRIVATE
    ${BACKEND_INCLUDE_DIRS}
)

target_link_libraries(ltc_server PRIVATE
    Threads::Threads
)

message(STATUS "Configured LTC (Learn The Concept) C++ Server target: ltc_server")
