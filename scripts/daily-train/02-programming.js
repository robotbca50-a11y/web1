// 02-programming.js - Deep programming questions across all languages
module.exports = function(addTopic) {

addTopic("PROGRAMMING", [
  // === PYTHON ===
  "Ajarkan saya Python dari nol sampai mahir - variables, data types, control flow, functions, OOP, decorators, generators, context managers, metaclasses, dan project structure yang benar.",
  "Jelaskan tentang Python advanced - GIL (Global Interpreter Lock), memory management, garbage collection, asyncio vs threading vs multiprocessing, descriptors, slots, dan performance optimization.",
  "Bagaimana cara membangun web scraping dengan Python? BeautifulSoup, Scrapy, Selenium, Playwright, anti-scraping techniques, robots.txt, ethical considerations, dan scaling scraping infrastructure.",
  "Ajarkan saya tentang Python design patterns - Singleton, Factory, Observer, Strategy, Decorator, Adapter, dan bagaimana menggunakannya dalam real-world projects.",
  "Jelaskan tentang Python data science stack - NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, Jupyter notebooks, data cleaning, feature engineering, dan model evaluation.",
  "Bagaimana cara membangun REST API dengan Python? Flask vs FastAPI vs Django REST, authentication, validation, database integration, testing, dan deployment.",

  // === JAVASCRIPT/TYPESCRIPT ===
  "Ajarkan saya JavaScript modern secara mendalam - ES6+, closures, prototypes, event loop, async/await, Promises, error handling, modules, dan CommonJS vs ES Modules.",
  "Jelaskan tentang JavaScript engine internals - V8, SpiderMonkey, JIT compilation, hidden classes, inline caching, garbage collection, dan performance optimization techniques.",
  "Bagaimana cara membangun full-stack application dengan Next.js? Server components, client components, API routes, authentication, database integration, deployment, dan performance optimization.",
  "Ajarkan saya tentang TypeScript - basic types, interfaces, generics, utility types, conditional types, mapped types, declaration files, dan migration strategies from JS to TS.",
  "Jelaskan tentang JavaScript testing - Jest, Vitest, Testing Library, Cypress, Playwright, unit vs integration vs E2E testing, mocking strategies, dan test-driven development.",

  // === REACT ===
  "Ajarkan saya React secara mendalam - component lifecycle, hooks (useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef), custom hooks, error boundaries, dan performance optimization.",
  "Jelaskan tentang React patterns - compound components, render props, higher-order components, context patterns, state machines (XState), dan scalable architecture.",
  "Bagaimana cara membangun real-time applications dengan React? WebSockets, Server-Sent Events, polling, optimistic updates, conflict resolution, dan offline-first strategies.",
  "Ajarkan saya tentang React performance - React.memo, useMemo, useCallback, code splitting, lazy loading, virtual lists (react-window), bundle analysis, dan profiling tools.",

  // === GO ===
  "Ajarkan saya Go (Golang) dari nol - syntax, data types, functions, structs, interfaces, goroutines, channels, error handling, package management, dan Go project structure.",
  "Jelaskan tentang Go concurrency - goroutines vs threads, channels, select statement, sync package, context package, worker pools, fan-out/fan-in patterns, dan common concurrency bugs.",
  "Bagaimana cara membangun microservices dengan Go? Service architecture, gRPC vs REST, message queues, distributed tracing, circuit breakers, dan deployment with Docker/Kubernetes.",

  // === RUST ===
  "Ajarkan saya Rust dari nol - ownership, borrowing, lifetimes, traits, generics, pattern matching, error handling, macros, unsafe code, dan Rust project structure.",
  "Jelaskan tentang Rust memory safety - ownership model, borrowing rules, lifetime annotations, smart pointers (Box, Rc, Arc, RefCell), interior mutability, dan zero-cost abstractions.",
  "Bagaimana cara membangun web services dengan Rust? Actix-web vs Axum, async runtime, database integration, authentication, testing, dan deployment.",

  // === JAVA ===
  "Ajarkan saya Java secara mendalam - OOP principles, collections framework, generics, streams, lambda expressions, concurrency (ExecutorService, CompletableFuture), dan JVM internals.",
  "Jelaskan tentang Spring Boot - dependency injection, auto-configuration, REST APIs, data JPA, security, testing, actuator, dan production deployment best practices.",

  // === C/C++ ===
  "Ajarkan saya C programming dari nol - pointers, memory management, structs, file I/O, dynamic allocation, data structures implementation, dan C best practices.",
  "Jelaskan tentang C++ modern - smart pointers, move semantics, lambdas, concepts, ranges, coroutines, template metaprogramming, dan C++ design patterns.",

  // === OTHER LANGUAGES ===
  "Ajarkan saya PHP modern (8.x) - typed properties, enums, fibers, attributes, match expression, named arguments, dan Laravel/Symfony frameworks.",
  "Jelaskan tentang Ruby on Rails - MVC pattern, ActiveRecord, callbacks, concerns, API mode, testing with RSpec, dan Rails performance optimization.",
  "Ajarkan saya Swift programming - optionals, protocols, extensions, generics, concurrency (async/await, actors), SwiftUI, dan iOS development basics.",

  // === SQL ===
  "Ajarkan saya SQL secara mendalam - JOINs, subqueries, CTEs, window functions, indexing strategies, query optimization, execution plans, dan database design principles.",
  "Jelaskan tentang database design - normalization (1NF-3NF), denormalization, schema design, migration strategies, backup/restore, dan database performance tuning.",

  // === DEVOPS ===
  "Ajarkan saya Docker secara mendalam - Dockerfile best practices, multi-stage builds, docker-compose, networking, volumes, security hardening, dan container orchestration.",
  "Jelaskan tentang Kubernetes - pods, services, deployments, configmaps, secrets, ingress, operators, Helm charts, dan production Kubernetes best practices.",
  "Bagaimana cara membangun CI/CD pipeline? GitHub Actions, Jenkins, GitLab CI, automated testing, deployment strategies (blue-green, canary), dan rollback procedures.",

  // === DATA STRUCTURES & ALGORITHMS ===
  "Ajarkan saya data structures fundamental - arrays, linked lists, stacks, queues, trees (BST, AVL, Red-Black), hash tables, heaps, graphs, dan trade-offs antar data structures.",
  "Jelaskan tentang algorithms - sorting (quicksort, mergesort, heapsort), searching (binary search, BFS, DFS), graph algorithms (Dijkstra, Bellman-Ford), dynamic programming, dan greedy algorithms.",
  "Bagaimana cara memecahkan masalah dengan dynamic programming? Memoization vs tabulation, common patterns (knapsack, LIS, LCS), state transitions, dan optimization techniques.",

  // === SYSTEM DESIGN ===
  "Ajarkan saya system design dari nol - scalability (horizontal vs vertical), load balancing, caching strategies, database sharding, microservices vs monolith, dan CAP theorem.",
  "Jelaskan tentang designing real-world systems - URL shortener, chat system, social media feed, video streaming, payment system, dan distributed file storage.",
  "Bagaimana cara mendesain system yang scalable? Caching layers, CDN, database replication, message queues, rate limiting, circuit breakers, dan monitoring/alerting.",
]);
};
