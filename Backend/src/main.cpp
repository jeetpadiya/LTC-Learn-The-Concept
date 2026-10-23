#include <iostream>
#include <vector>
#include <string>
#include "crow/crow_all.h"
#include "algorithms/sort_engine.hpp"

// Simple CORS middleware helper
struct CorsMiddleware {
    struct context {};

    void before_handle(crow::request&, crow::response&, context&) {}

    void after_handle(crow::request&, crow::response& res, context&) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
};

int main(int argc, char* argv[]) {
    int port = 18080;
    if (argc > 1) {
        port = std::stoi(argv[1]);
    }

    crow::App<CorsMiddleware> app;

    // Handle OPTIONS preflight for all endpoints
    CROW_ROUTE(app, "/<path>")
    .methods(crow::HTTPMethod::OPTIONS)([](const crow::request&, crow::response& res, std::string) {
        res.code = 204;
        res.end();
    });

    CROW_ROUTE(app, "/api/<path>")
    .methods(crow::HTTPMethod::OPTIONS)([](const crow::request&, crow::response& res, std::string) {
        res.code = 204;
        res.end();
    });

    // 1. Health check route
    CROW_ROUTE(app, "/health")([]() {
        crow::json::wvalue res;
        res["status"] = "healthy";
        res["engine"] = "LTC (Learn The Concept) C++ Engine";
        res["version"] = "1.0.0";
        return res;
    });

    // 2. Algorithm listing route
    CROW_ROUTE(app, "/api/algorithms")([]() {
        crow::json::wvalue res;
        res["algorithms"] = std::vector<std::string>{
            "bubble",
            "selection",
            "insertion",
            "quick"
        };
        return res;
    });

    // 3. Execution trace generation endpoint
    CROW_ROUTE(app, "/api/sort/<string>")
    .methods(crow::HTTPMethod::POST)([](const crow::request& req, crow::response& res, std::string algo) {
        auto body = crow::json::load(req.body);
        if (!body) {
            res.code = 400;
            res.write(R"({"error": "Invalid JSON body"})");
            res.end();
            return;
        }

        if (!body.has("array") || body["array"].t() != crow::json::type::List) {
            res.code = 400;
            res.write(R"({"error": "Missing or invalid 'array' field in JSON"})");
            res.end();
            return;
        }

        std::vector<int> arr;
        for (const auto& item : body["array"]) {
            if (item.t() == crow::json::type::Number) {
                arr.push_back(static_cast<int>(item.i()));
            }
        }

        if (arr.empty()) {
            res.code = 400;
            res.write(R"({"error": "Array cannot be empty"})");
            res.end();
            return;
        }

        std::vector<dsa::TraceStep> steps;
        if (algo == "bubble") {
            steps = dsa::SortEngine::bubbleSort(arr);
        } else if (algo == "selection") {
            steps = dsa::SortEngine::selectionSort(arr);
        } else if (algo == "insertion") {
            steps = dsa::SortEngine::insertionSort(arr);
        } else if (algo == "quick") {
            steps = dsa::SortEngine::quickSort(arr);
        } else {
            res.code = 404;
            crow::json::wvalue err;
            err["error"] = "Unknown algorithm: " + algo;
            res.write(err.dump());
            res.end();
            return;
        }

        crow::json::wvalue responseJson;
        responseJson["algorithm"] = algo;
        responseJson["totalSteps"] = static_cast<int>(steps.size());

        std::vector<crow::json::wvalue> stepsJson;
        stepsJson.reserve(steps.size());
        for (const auto& step : steps) {
            stepsJson.emplace_back(step.toJson());
        }
        responseJson["steps"] = std::move(stepsJson);

        res.code = 200;
        res.set_header("Content-Type", "application/json");
        res.write(responseJson.dump());
        res.end();
    });

    // 4. WebSocket route for real-time streaming
    CROW_WEBSOCKET_ROUTE(app, "/ws/sort")
    .onopen([&](crow::websocket::connection& conn) {
        std::cout << "[WS] Client connected: " << &conn << std::endl;
        conn.send_text(R"({"type": "connected", "message": "DSA WebSocket Engine Ready"})");
    })
    .onclose([&](crow::websocket::connection& conn, const std::string& reason, uint16_t /*status_code*/) {
        std::cout << "[WS] Client disconnected: " << &conn << " (" << reason << ")" << std::endl;
    })
    .onmessage([&](crow::websocket::connection& conn, const std::string& data, bool is_binary) {
        if (is_binary) return;

        auto body = crow::json::load(data);
        if (!body || !body.has("algorithm") || !body.has("array")) {
            conn.send_text(R"({"error": "Expected JSON with 'algorithm' and 'array'"})");
            return;
        }

        std::string algo = body["algorithm"].s();
        std::vector<int> arr;
        for (const auto& item : body["array"]) {
            arr.push_back(static_cast<int>(item.i()));
        }

        std::vector<dsa::TraceStep> steps;
        if (algo == "bubble") steps = dsa::SortEngine::bubbleSort(arr);
        else if (algo == "selection") steps = dsa::SortEngine::selectionSort(arr);
        else if (algo == "insertion") steps = dsa::SortEngine::insertionSort(arr);
        else if (algo == "quick") steps = dsa::SortEngine::quickSort(arr);

        for (const auto& step : steps) {
            conn.send_text(step.toJson().dump());
        }

        conn.send_text(R"({"action": "complete", "description": "Sorting trace finished"})");
    });

    std::cout << "========================================\n";
    std::cout << "  LTC (Learn The Concept) - C++ Engine\n";
    std::cout << "  Running on port :" << port << "\n";
    std::cout << "  Health: http://localhost:" << port << "/health\n";
    std::cout << "  Sort API: POST http://localhost:" << port << "/api/sort/<algo>\n";
    std::cout << "  WebSocket: ws://localhost:" << port << "/ws/sort\n";
    std::cout << "========================================\n" << std::flush;

    app.bindaddr("127.0.0.1").port(port).multithreaded().run();
    return 0;
}
