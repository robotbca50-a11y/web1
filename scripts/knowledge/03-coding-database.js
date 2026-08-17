// 03-coding-database.js - SQL, MongoDB, Redis, PostgreSQL, MySQL, Prisma, etc.
module.exports = function(add) {

// SQL Basics (10 entries)
add('sql_select', `SQL SELECT: SELECT column1,column2 FROM table. SELECT * FROM users. SELECT DISTINCT country FROM users. SELECT name AS n FROM users. SELECT TOP 10 * FROM users (SQL Server). SELECT * FROM users LIMIT 10 (MySQL/PostgreSQL). SELECT * FROM users FETCH FIRST 10 ROWS ONLY (Oracle).`, 'coding');
add('sql_where', `SQL WHERE: WHERE age>18. WHERE name LIKE "%john%". WHERE name LIKE "j%n". WHERE age BETWEEN 18 AND 30. WHERE country IN ("ID","MY","SG"). WHERE email IS NOT NULL. WHERE age>=18 AND active=1. WHERE NOT banned=1. WHERE (a=1 OR b=2) AND c=3.`, 'coding');
add('sql_join', `SQL JOIN: INNER JOIN only matching. LEFT JOIN all left. RIGHT JOIN all right. FULL OUTER JOIN both. CROSS JOIN cartesian. JOIN orders ON users.id=orders.user_id. NATURAL JOIN auto-match columns. Self JOIN: e JOIN m ON e.manager_id=m.id.`, 'coding');
add('sql_aggregate', `SQL Aggregates: COUNT(*) total. SUM(amount) total. AVG(price) average. MAX(salary) highest. MIN(price) lowest. GROUP BY country HAVING COUNT(*)>5. GROUP BY with ROLLUP for subtotals. GROUPING SETS for multiple groupings. COUNT(DISTINCT user_id).`, 'coding');
add('sql_insert', `SQL INSERT: INSERT INTO users(name,email) VALUES("Budi","budi@mail.com"). INSERT INTO users VALUES("Budi","budi@mail.com"). INSERT INTO users(name,email) SELECT name,old_email FROM old_users. INSERT many: VALUES (1,"a"),(2,"b"),(3,"c").`, 'coding');
add('sql_update', `SQL UPDATE: UPDATE users SET name="Budi",age=26 WHERE id=1. UPDATE users SET salary=salary*1.1 WHERE dept="IT". UPDATE with JOIN: UPDATE u SET u.dept=d.new_name FROM users u JOIN dept_map d ON u.dept=d.old. Always use WHERE to avoid updating all rows.`, 'coding');
add('sql_delete', `SQL DELETE: DELETE FROM users WHERE id=1. DELETE FROM users WHERE age<18. TRUNCATE TABLE users (faster, reset auto-increment). DELETE u FROM users u JOIN inactive i ON u.id=i.user_id (delete with JOIN). Always backup before DELETE.`, 'coding');
add('sql_index', `SQL Indexes: CREATE INDEX idx_name ON users(name). CREATE UNIQUE INDEX idx_email ON users(email). CREATE INDEX idx_composite ON users(dept,age). DROP INDEX idx_name. Index speeds up WHERE/JOIN/ORDER BY. Slows down INSERT/UPDATE. Covering index includes all columns.`, 'coding');
add('sql_subquery', `SQL Subqueries: WHERE id IN (SELECT user_id FROM orders). WHERE salary>(SELECT AVG(salary) FROM employees). FROM (SELECT * FROM active) AS sub. EXISTS: WHERE EXISTS(SELECT 1 FROM orders WHERE user_id=users.id). Correlated subquery references outer table.`, 'coding');
add('sql_view', `SQL Views: CREATE VIEW active_users AS SELECT * FROM users WHERE active=1. SELECT * FROM active_users. Materialized view stores results: CREATE MATERIALIZED VIEW mv AS SELECT... REFRESH MATERIALIZED VIEW mv. Views simplify complex queries, add security layer.`, 'coding');

// PostgreSQL (6 entries)
add('postgres_json', `PostgreSQL JSONB: column jsonb. SELECT data->"name" AS text. data->>"name"::text. data@>"{"active":true}" contains. data?"name" key exists. jsonb_array_elements(data->"items") unnest. CREATE INDEX ON t USING GIN(data). UPDATE t SET data=jsonb_set(data,"{name}","new").`, 'coding');
add('postgres_cte', `PostgreSQL CTE: WITH recursive_cte AS (SELECT id,parent_id FROM tree WHERE parent_id IS NULL UNION ALL SELECT t.id,t.parent_id FROM tree t JOIN recursive_cte c ON t.parent_id=c.id) SELECT * FROM recursive_cte. CTEs for readability, recursion, temporary result sets.`, 'coding');
add('postgres_window', `PostgreSQL Window: ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC). RANK() ties get same rank. DENSE_RANK() no gaps. LAG(salary,1) OVER(ORDER BY date). LEAD(salary,1). SUM(amount) OVER(PARTITION BY user_id ORDER BY date ROWS UNBOUNDED PRECEDING) running total.`, 'coding');
add('postgres_fulltext', `PostgreSQL Full-Text: tsvector, tsquery. SELECT * FROM articles WHERE to_tsvector("english",title||" "||body) @@ to_tsquery("english","python & tutorial"). GiST/GIN index. ts_rank() scoring. plainto_tsquery simpler. websearch_to_tsquery Google-like.`, 'coding');
add('postgres_rls', `PostgreSQL RLS: ALTER TABLE orders ENABLE ROW LEVEL SECURITY. CREATE POLICY user_orders ON orders FOR ALL USING (user_id=auth.uid()). Permissive vs restrictive. WITH CHECK for INSERT/UPDATE. Service role bypasses RLS. Public anon key respects RLS.`, 'coding');
add('postgres_partition', `PostgreSQL Partitioning: CREATE TABLE orders(id bigserial,created_at timestamptz,PRIMARY KEY(id,created_at)) PARTITION BY RANGE(created_at). CREATE TABLE orders_2024 PARTITION OF orders FOR VALUES FROM ("2024-01-01") TO ("2025-01-01"). Hash partitioning too.`, 'coding');

// MySQL (4 entries)
add('mysql_basics', `MySQL: SELECT * FROM users LIMIT 10 OFFSET 20. AUTO_INCREMENT for IDs. ENGINE=InnoDB. IFNULL(col,default). COALESCE(a,b,c). NOW() current datetime. CURDATE() date only. DATE_FORMAT(date,"%Y-%m-%d"). GROUP_CONCAT(name SEPARATOR ",") list aggregation.`, 'coding');
add('mysql_json', `MySQL JSON: column JSON. SELECT data->"$.name" AS VARCHAR. JSON_EXTRACT(data,"$.name"). JSON_SET(data,"$.x",1). JSON_INSERT(data,"$.x",1). JSON_REPLACE. JSON_REMOVE. JSON_CONTAINS. JSON_ARRAY. JSON_OBJECT. CREATE INDEX ON t((CAST(data->"$.x" AS UNSIGNED))).`, 'coding');

// MongoDB (6 entries)
add('mongo_basics', `MongoDB: db.users.find({age:{$gt:18}}). find({name:/john/i}) regex. find({$and:[{age:{$gt:18}},{active:true}]}). find({}).sort({name:1}).limit(10).skip(20). projection: find({},{name:1,email:1}). findOne({email:"x@y.com"}). countDocuments({active:true}).`, 'coding');
add('mongo_insert', `MongoDB Insert: db.users.insertOne({name:"Budi",age:25}). db.users.insertMany([{name:"A"},{name:"B"}]). insert returns acknowledged:true. Bulk insert array. Let MongoDB generate _id or provide custom.`, 'coding');
add('mongo_update', `MongoDB Update: db.users.updateOne({name:"Budi"},{$set:{age:26}}). updateMany({active:{$ne:true}},{$set:{active:true}}). $inc increment. $push add to array. $pull remove from array. $addToSet add unique. $unset remove field. upsert:true create if not exists.`, 'coding');
add('mongo_aggregate', `MongoDB Aggregation: db.users.aggregate([{$match:{age:{$gte:18}}},{$group:{_id:"$country",count:{$sum:1}}},{$sort:{count:-1}}]). $lookup join. $unwind array. $project reshape. $addFields new fields. $limit, $skip, $sample random.`, 'coding');
add('mongo_index', `MongoDB Indexes: db.users.createIndex({email:1},{unique:true}). db.users.createIndex({name:"text",bio:"text"}). db.users.createIndex({"address.city":1}). Compound: createIndex({dept:1,age:-1}). explain("executionStats") check index usage.`, 'coding');

// Redis (5 entries)
add('redis_basics', `Redis Basics: SET key value. GET key. DEL key. EXISTS key. EXPIRE key 3600 TTL. KEYS pattern. SETEX key 3600 value (set+expire). MSET key1 v1 key2 v2. MGET key1 key2. INCR counter. INCRBY counter 5. DECR. APPEND key "more".`, 'coding');
add('redis_data', `Redis Data Structures: LIST: LPUSH/RPUSH/POP/LRANGE. SET: SADD/SMEMBERS/SINTER/SUNION. HASH: HSET/HGET/HGETALL/HINCRBY. ZSET: ZADD/ZRANGE/ZRANGEBYSCORE/ZRANK. HyperLogLog: PFADD/PFCOUNT for counting. Bitmap: SETBIT/BITCOUNT.`, 'coding');
add('redis_queue', `Redis Queue: LPUSH queue "task1". BRPOP queue 0 (blocking pop). RPOPLPUSH src dst (reliable). Stream: XADD events * name val. XREAD COUNT 10 STREAMS events 0. Consumer groups: XGROUP CREATE. XREADGROUP GROUP g1 consumer. XPENDING/ACK.`, 'coding');
add('redis_cache', `Redis Caching: Cache-aside: GET check, if miss DB+SET. Write-through: write DB+cache. Write-behind: write cache, async DB. Cache invalidation: DEL key on update. TTL-based expiry. Cache stampede: use SETNX for lock. Jitter TTL to prevent thundering herd.`, 'coding');
add('redis_session', `Redis Sessions: Store session data: SET session:{userId} JSON. EXPIRE 1800 (30min). Session middleware: check SET key, parse JSON. Resave on activity: EXPIRE refresh. Store user preferences, cart, auth state. Much faster than DB sessions.`, 'coding');

// Prisma & ORMs (4 entries)
add('prisma_basics', `Prisma: model User{id Int @id @default(autoincrement()) name String email String @unique posts Post[]}. npx prisma migrate dev. const users=await prisma.user.findMany({where:{active:true},include:{posts:true}}). create, update, delete, upsert.`, 'coding');
add('prisma_query', `Prisma Queries: findMany({where:{age:{gte:18}},orderBy:{name:"asc"},take:10,skip:0}). findUnique({where:{email:"x@y.com"}}). findFirst. groupBy({by:["country"],_count:true,_avg:{salary:true}}).事务: prisma.$transaction([op1,op2]).`, 'coding');
add('prisma_relation', `Prisma Relations: model Post{author User @relation(fields:[authorId],references:[id]) authorId Int}. One-to-many: Post[] on User. Many-to-many: @relation implicit or explicit. @default(now()) createdAt. @map("db_col") column name.`, 'coding');
add('drizzle_basics', `Drizzle ORM: const users=pgTable("users",{id:serial("id"),name:text("name")}). select().from(users).where(eq(users.name,"Budi")). insert(users).values({name:"Budi"}). update(users).set({name:"Budi2"}). sql template. Type-safe queries.`, 'coding');

// Supabase (6 entries)
add('supabase_client', `Supabase Client: import{createClient}from"@supabase/supabase-js". const supa=createClient(url,anonKey). const{data,error}=await supa.from("users").select("*").eq("id",1). Single: .single(). RLS enforced on anon key.`, 'coding');
add('supabase_auth', `Supabase Auth: supa.auth.signUp({email:"x@y.com",password:"pass"}). signInWithPassword({email,password}). signOut(). getUser(). onAuthStateChange((e,s)=>{}). OAuth: signInWithOAuth({provider:"google"}). Magic link: signInWithOtp({email}).`, 'coding');
add('supabase_storage', `Supabase Storage: await supa.storage.from("avatars").upload("user1/photo.jpg",file). getPublicUrl("user1/photo.jpg"). createSignedUrl(path,3600). list("folder"). delete(["file.jpg"]). Bucket policies control access.`, 'coding');
add('supabase_rls', `Supabase RLS: Enable RLS on table. CREATE POLICY "name" ON table FOR SELECT USING (auth.uid()=user_id). FOR INSERT WITH CHECK (auth.uid()=user_id). FOR UPDATE. FOR DELETE. Anon key respects RLS. Service role key bypasses RLS.`, 'coding');
add('supabase_realtime', `Supabase Realtime: const channel=supa.channel("room").on("postgres_changes",{event:"*",schema:"public",table:"messages"},payload=>{console.log(payload)}).subscribe(). Broadcast: channel.send({type:"broadcast",event:"msg",payload:{text:"hi"}}).`, 'coding');
add('supabase_rpc', `Supabase RPC: CREATE FUNCTION get_users(active boolean) RETURNS SETOF users AS $$ SELECT * FROM users WHERE is_active=$1 $$ LANGUAGE sql. Call: supa.rpc("get_users",{active:true}). RPC bypasses RLS if SECURITY DEFINER. Great for complex queries.`, 'coding');
};
