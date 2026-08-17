// 05-coding-advanced.js - Algorithms, Data Structures, Design Patterns, System Design, Security, Crypto
module.exports = function(add) {

// Algorithms (10 entries)
add('algo_binary_search', `Binary Search: O(log n). Find target in sorted array. low=0,high=arr.length-1. mid=Math.floor((low+high)/2). if arr[mid]==target return mid. if arr[mid]<target low=mid+1 else high=mid-1. Works on sorted data only. Recursive or iterative.`, 'coding');
add('algo_sorting', `Sorting: Bubble O(n²) swap adjacent. Selection O(n²) min to front. Insertion O(n²) shift right. Merge O(n log n) divide+merge. Quick O(n log n) avg pivot partition. Heap O(n log n) using heap. Counting O(n+k). Radix O(dn). TimSort O(n log n) Python/JS default.`, 'coding');
add('algo_graph', `Graph Algorithms: BFS level-order using queue. DFS depth using stack/recursion. Dijkstra shortest path weighted. Bellman-Ford handles negatives. Floyd-Warshall all pairs. Kruskal MST sort edges. Prim MST greedy grow tree. Topological sort DAG ordering.`, 'coding');
add('algo_dp', `Dynamic Programming: Optimal substructure + overlapping subproblems. Fibonacci: dp[0]=0,dp[1]=1,dp[i]=dp[i-1]+dp[i-2]. Knapsack: dp[i][w]=max(dp[i-1][w],dp[i-1][w-wi]+vi). LCS: if a[i]==b[j] dp[i][j]=dp[i-1][j-1]+1 else max. Memoization(top-down) or tabulation(bottom-up).`, 'coding');
add('algo_string', `String Algorithms: KMP pattern matching O(n+m). Rabin-Karp rolling hash. Boyer-Moore skip characters. Levenshtein edit distance: dp[i][j]=min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+cost). Longest common substring. Trie prefix tree.`, 'coding');
add('algo_tree', `Tree Traversal: Inorder left-root-right (BST sorted). Preorder root-left-right (copy). Postorder left-right-root (delete). Level-order BFS queue. Morris traversal O(1) space. BST operations: insert/search/delete O(log n) avg.`, 'coding');
add('algo_two_pointer', `Two Pointer: Sorted array: left=0,right=len-1. if sum<target left++ else right--. Container with most water: area=min(h[l],h[r])*(r-l). Sliding window: expand right, shrink left when invalid. Fast/slow pointer for cycles.`, 'coding');
add('algo_recursion', `Recursion: Base case + recursive case. Factorial: f(n)=n*f(n-1). Fibonacci: f(n)=f(n-1)+f(n-2). Divide and conquer: merge sort, quick sort. Backtracking: try, undo if fails. Tail recursion optimization. Stack overflow risk.`, 'coding');
add('algo_greedy', `Greedy Algorithms: Make locally optimal choice. Activity selection: sort by end time, pick non-overlapping. Huffman coding: merge smallest frequency. Kruskal MST. Fractional knapsack: sort by value/weight ratio. Not always optimal.`, 'coding');
add('algo_bigo', `Big-O Notation: O(1) constant. O(log n) logarithmic. O(n) linear. O(n log n) linearithmic. O(n²) quadratic. O(n³) cubic. O(2^n) exponential. O(n!) factorial. Space complexity too. Drop constants: O(2n)=O(n). Worst case analysis.`, 'coding');

// Data Structures (6 entries)
add('ds_array', `Arrays: Contiguous memory. Access O(1) by index. Search O(n) unsorted. Insert O(n) shift. Dynamic array: amortized O(1) push. Slicing. 2D array: matrix[r][c]. Circular buffer. Prefix sum for range queries.`, 'coding');
add('ds_linkedlist', `Linked List: Node{val,next}. Singly, doubly, circular. Insert O(1) at head. Delete O(1) if node known. Search O(n). Reversal: prev=null,while(curr){next=curr.next;curr.next=prev;prev=curr;curr=next}. Cycle detection: Floyd tortoise-hare.`, 'coding');
add('ds_stack', `Stack: LIFO. push O(1), pop O(1), peek O(1). Undo/redo. Browser history. Expression evaluation. Parentheses matching. Monotonic stack for next greater element. Infix to postfix conversion.`, 'coding');
add('ds_queue', `Queue: FIFO. enqueue O(1), dequeue O(1). BFS traversal. Job scheduling. Priority queue: heap-based O(log n) insert/extract. Circular queue. Deque double-ended. Level-order tree traversal.`, 'coding');
add('ds_hashmap', `Hash Map: key->hash->index. Average O(1) get/put. Collision: chaining (linked list) or open addressing. Load factor <0.75. Resizing O(n). Consistent hashing for distributed. OrderedDict for LRU. Map/Set in JS.`, 'coding');
add('ds_heap', `Heap: Complete binary tree. Max-heap: parent>children. Min-heap: parent<children. Insert O(log n). Extract-min/max O(log n). Heapify O(n). Priority queue. Heap sort O(n log n). Top K: heap of size K. Median: two heaps.`, 'coding');

// Design Patterns (8 entries)
add('pattern_singleton', `Singleton: One instance globally. class Singleton{static #instance;static get instance(){if(!this.#instance)this.#instance=new Singleton();return this.#instance;}constructor(){if(Singleton.#instance)throw new Error("Use Singleton.instance")}}. Config, logger, DB connection.`, 'coding');
add('pattern_factory', `Factory: Object creation without specifying class. function createAnimal(type){switch(type){case"dog":return new Dog();case"cat":return new Cat()}}. Abstract Factory: factory for families of objects. Reduces coupling. Testability.`, 'coding');
add('pattern_observer', `Observer: One-to-many dependency. Subject maintains observers list. subscribe/unsubscribe/notify. Event emitters. React state. Pub/sub. Loose coupling. Risk: memory leaks if not unsubscribed. Update propagation order.`, 'coding');
add('pattern_strategy', `Strategy: interchangeable algorithms. class Sorter{constructor(strategy){this.strategy=strategy}sort(arr){return this.strategy(arr)}}. new Sorter(quickSort). new Sorter(mergeSort). Runtime algorithm swap. No conditionals.`, 'coding');
add('pattern_decorator', `Decorator: Add behavior without modifying original. function withLogging(fn){return function(...args){console.log("calling",args);const result=fn(...args);console.log("result",result);return result}}. Wrapping. Middleware pattern. Composition.`, 'coding');
add('pattern_proxy', `Proxy: Control access to object. const handler={get(target,prop){console.log("accessing",prop);return Reflect.get(target,prop)}}. new Proxy(obj,handler). Caching proxy, validation proxy, access control. ES6 Proxy in JS.`, 'coding');
add('pattern_mvc', `MVC: Model(data+business logic), View(UI), Controller(handles input, updates model+view). React: Component=View+Controller, State=Model. Separation of concerns. Passive View. Supervising Controller.`, 'coding');
add('pattern_repository', `Repository: Abstract data access layer. class UserRepository{async findById(id){return db.users.findOne({id})}async save(user){return db.users.upsert(user)}}. Domain-centric. Testable (mock repository). Decouples business from persistence.`, 'coding');

// System Design (6 entries)
add('sysdesign_caching', `Caching: CDN edge cache. Application cache (Redis/Memcached). Database query cache. Browser cache. Cache-aside, write-through, write-behind. Cache invalidation: TTL, event-driven. Cache stampede prevention. Hot keys problem.`, 'coding');
add('sysdesign_scaling', `Scaling: Vertical: bigger machine. Horizontal: more machines. Load balancer: round-robin, least connections, IP hash. Auto-scaling groups. Database: read replicas, sharding. Stateless services. Session storage external.`, 'coding');
add('sysdesign_microservices', `Microservices: Small, independent, deployable services. API Gateway pattern. Service mesh. Event-driven: Kafka/RabbitMQ. Saga pattern for distributed transactions. Circuit breaker. Idempotency. Service discovery.`, 'coding');
add('sysdesign_queue', `Message Queues: Producer-Consumer-Broker. RabbitMQ: exchange, queue, binding, routing key. Kafka: topic, partition, consumer group. SQS: visibility timeout, dead letter. Exactly-once delivery challenge. Ordering guarantees.`, 'coding');
add('sysdesign_db', `Database Design: Normalization (1NF-3NF). Denormalization for reads. Indexing strategy. Connection pooling. Partitioning: range/hash/list. Replication: leader-follower. CAP theorem. ACID vs BASE. Sharding strategies.`, 'coding');
add('sysdesign_reliable', `Reliability: Health checks. Graceful degradation. Timeout + retry with backoff. Circuit breaker. Rate limiting: token bucket, sliding window. Dead letter queues. Monitoring + alerting. SLA targets.`, 'coding');

// Security (8 entries)
add('sec_xss', `XSS Prevention: <script> injection. Encode output: HTML entities. Content-Security-Policy header. HttpOnly cookies (no JS access). Sanitize input: DOMPurify. React auto-escapes in JSX. dangerouslySetInnerHTML risk. Template injection.`, 'coding');
add('sec_sqli', `SQL Injection Prevention: Always parameterized queries. Never string concat for SQL. Prepared statements. ORM parameterization. Input validation as defense in depth. WAF rules. Least privilege DB user. Stored procedures.`, 'coding');
add('sec_auth', `Authentication: Password hashing: bcrypt/argon2 (never MD5/SHA1). Salt per password. MFA: TOTP (Google Authenticator). Session management: secure, HttpOnly, SameSite cookies. OAuth 2.0 flows. JWT best practices.`, 'coding');
add('sec_cors', `CORS: Access-Control-Allow-Origin: specific domain, not *. Credentials: Access-Control-Allow-Credentials:true. Preflight: OPTIONS request. Access-Control-Allow-Methods/Headers. Private network access. Credential stuffing defense.`, 'coding');
add('sec_rate_limit', `Rate Limiting: Token bucket: add tokens at fixed rate, consume per request. Sliding window: count requests in window. Fixed window: reset at interval. nginx: limit_req_zone. Redis: INCR+EXPIRE. API: 429 Too Many Requests.`, 'coding');
add('sec_https', `HTTPS: TLS encrypts in transit. Certificate: Let's Encrypt free. HSTS: Strict-Transport-Security. Redirect HTTP->HTTPS. OCSP stapling. Certificate pinning. Mixed content warnings.`, 'coding');
add('sec_header', `Security Headers: Content-Security-Policy: default-src self. X-Content-Type-Options: nosniff. X-Frame-Options: DENY. Referrer-Policy: strict-origin. Permissions-Policy: camera=(empty). X-XSS-Protection: 0 (deprecated, use CSP).`, 'coding');

// Cryptography (4 entries)
add('crypto_symmetric', `Symmetric Encryption: Same key encrypt+decrypt. AES-256-GCM: authenticated encryption. ChaCha20-Poly1305. Fast for large data. Key distribution problem. Use: file encryption, database field encryption. IV/nonce required.`, 'coding');
add('crypto_asymmetric', `Asymmetric Encryption: Public+private key pair. RSA 2048+. ECC smaller keys. Encrypt with public, decrypt with private. Sign with private, verify with public. Key exchange. TLS handshake. Digital certificates.`, 'coding');
add('crypto_hash', `Cryptographic Hash: SHA-256, SHA-3, BLAKE2. One-way, deterministic, collision resistant. Password storage: bcrypt/scrypt/argon2 (slow hash + salt). HMAC: hash-based message authentication. Integrity verification.`, 'coding');
add('crypto_jwt', `JWT: Header(payload).payload(data).signature(verify). Header:alg,typ. Payload:sub,iss,exp,iat,claims. RS256 asymmetric or HS256 symmetric. Never store secrets in payload. Verify signature. Refresh token rotation.`, 'coding');
};
