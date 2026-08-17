// 01-cybersecurity.js - Deep hacking, defense, forensics questions
// Each question is designed for comprehensive answer (attack + defense + theory)
module.exports = function(addTopic) {

addTopic("CYBERSECURITY", [
  // === OFFENSIVE SECURITY (ATTACK) ===
  "Ajarkan saya tentang ethical hacking dari nol sampai mahir - apa saja yang perlu dipelajari, tools apa yang dibutuhkan, bagaimana cara memulai karir di bidang ini, dan apa saja sertifikasi yang tersedia?",
  "Jelaskan secara mendalam tentang reconnaissance dalam ethical hacking - apa saja metodenya (passive vs active), tools yang digunakan (Nmap, Maltego, Shodan), dan bagaimana cara mengumpulkan informasi tentang target sebelum melakukan penetration testing.",
  "Bagaimana cara melakukan vulnerability assessment dan penetration testing secara lengkap? Jelaskan methodology-nya (OWASP, PTES, OSSTMM), tools yang digunakan, cara menulis laporan, dan etika yang harus dijaga.",
  "Ajarkan saya tentang web application hacking - OWASP Top 10, cara menemukan dan mengeksploitasi vulnerability seperti SQL injection, XSS, CSRF, SSRF, file inclusion, authentication bypass, dan bagaimana cara defense-nya.",
  "Jelaskan tentang network hacking - cara scanning network, enumerating services, man-in-the-middle attacks, ARP poisoning, DNS spoofing, packet sniffing, dan bagaimana cara mendeteksi serta mencegah serangan ini.",
  "Bagaimana cara melakukan password cracking? Jelaskan berbagai metode: brute force, dictionary attack, rainbow tables, credential stuffing, keylogging, social engineering untuk password, dan cara defense-nya.",
  "Ajarkan saya tentang wireless hacking - WEP, WPA, WPA2 cracking, evil twin attack, deauthentication attack, wardriving, dan bagaimana cara mengamankan wireless network dari serangan ini.",
  "Jelaskan tentang privilege escalation - bagaimana cara naik dari low-privilege access ke admin/root, kernel exploits, misconfigurations, SUID binaries, token impersonation, dan defense strategies.",
  "Bagaimana cara melakukan social engineering attacks? Phishing, vishing, smishing, pretexting, baiting, tailgating, dan bagaimana cara mendeteksi serta mencegahnya.",
  "Ajarkan saya tentang malware analysis - bagaimana cara reverse engineer malware, static vs dynamic analysis, sandboxing, decompiler, dan bagaimana cara defend dari malware.",
  "Jelaskan tentang exploit development - buffer overflow, ROP chains, shellcoding, zero-day exploits, exploit mitigations (ASLR, DEP, stack canaries), dan ethical considerations.",
  "Bagaimana cara melakukan API hacking? REST API testing, GraphQL exploitation, authentication bypass, rate limiting bypass, injection attacks pada API, dan securing API endpoints.",

  // === DEFENSIVE SECURITY (DEFENSE) ===
  "Ajarkan saya tentang security architecture - defense in depth, zero trust model, network segmentation, DMZ, firewall rules, IDS/IPS, SIEM, dan bagaimana design security yang robust.",
  "Jelaskan tentang incident response - bagaimana cara menangani security breach, containment strategies, eradicating threats, recovery procedures, post-incident analysis, dan building incident response plan.",
  "Bagaimana cara membangun security operations center (SOC)? Tool stack, SIEM configuration, log management, alert tuning, threat hunting, dan SOC metrics/KPIs.",
  "Ajarkan saya tentang threat intelligence - MITRE ATT&CK framework, threat modeling, IOC (Indicators of Compromise), threat feeds, STIX/TAXII, dan bagaimana menggunakannya untuk defense.",
  "Jelaskan tentang encryption end-to-end - TLS/SSL, certificate management, key exchange, symmetric vs asymmetric encryption, PGP/GPG, disk encryption, dan best practices.",
  "Bagaimana cara melakukan digital forensics? Evidence collection, chain of custody, memory forensics (Volatility), disk forensics, network forensics, mobile forensics, dan legal considerations.",
  "Ajarkan saya tentang security hardening - OS hardening, application hardening, configuration management, CIS benchmarks, compliance frameworks (ISO 27001, NIST), dan security auditing.",
  "Jelaskan tentang DDoS protection - types of DDoS attacks, mitigation strategies, CDN configuration, rate limiting, traffic analysis, cloud-based DDoS protection, dan incident handling.",
  "Bagaimana cara membangun secure software development lifecycle (SSDLC)? Threat modeling, secure coding practices, code review, SAST/DAST, DevSecOps, dan security testing automation.",

  // === CRYPTOGRAPHY ===
  "Ajarkan saya tentang cryptography secara mendalam - symmetric encryption (AES, DES), asymmetric encryption (RSA, ECC), hashing (SHA, MD5), digital signatures, PKI, key management, dan cryptographic attacks.",
  "Jelaskan tentang blockchain security - smart contract vulnerabilities, reentrancy attack, flash loans, front-running, MEV, bridge hacks, dan bagaimana cara audit smart contract.",
  "Bagaimana cara kerja HTTPS dan TLS? Handshake process, certificate chain, OCSP stapling, certificate pinning, TLS 1.3 improvements, dan common vulnerabilities.",

  // === MOBILE SECURITY ===
  "Ajarkan saya tentang mobile application security - Android vs iOS security models, common vulnerabilities, OWASP Mobile Top 10, reverse engineering mobile apps, certificate pinning bypass, dan secure mobile development.",

  // === CLOUD SECURITY ===
  "Jelaskan tentang cloud security - AWS/Azure/GCP security services, IAM best practices, S3 bucket security, serverless security, container security (Docker/Kubernetes), dan cloud compliance.",

  // === OPERATING SYSTEM SECURITY ===
  "Ajarkan saya tentang Linux security - file permissions, SELinux, AppArmor, audit logging, hardening scripts, rootkit detection, dan Linux forensics.",
  "Bagaimana cara memahami dan menganalisis malware? Static analysis, dynamic analysis, sandboxing, behavioral analysis, IOC extraction, dan threat intelligence integration.",

  // === BUG BOUNTY (DEEP) ===
  "Ajarkan saya bug bounty dari nol - platform apa saja (HackerOne, Bugcrowd, Intigriti), cara memulai, methodology, tools (Burp Suite, Nuclei, httpx, subfinder), triage, dan tips untuk mendapat bounty pertama.",
  "Jelaskan cara menemukan IDOR vulnerability - methodology testing, automation, real examples, chaining dengan other bugs, dan tips untuk maximize bounty.",
  "Bagaimana cara melakukan subdomain enumeration dan attack surface mapping? Tools (subfinder, amass, assetfinder), wildcard DNS, forgotten subdomains, dan attack scenarios.",
  "Ajarkan saya tentang business logic bugs - race conditions, coupon abuse, payment manipulation, privilege escalation through business logic, dan real-world examples.",
  "Bagaimana cara chaining vulnerabilities untuk Critical impact? Contoh: SSRF → internal service → RCE, XSS → account takeover, IDOR → data exfiltration, dan cara present ke program.",
  "Jelaskan tentang API security testing - broken object level auth, broken function level auth, mass assignment, GraphQL introspection abuse, dan real examples.",
  "Ajarkan saya cara menulis report bug bounty yang bagus - impact assessment, PoC steps, remediation, CVSS scoring, dan tips agar report accepted.",
  "Bagaimana cara bypass WAF? Techniques: encoding, fragmentation, case variation, HTTP parameter pollution, chunked transfer, dan WAF-specific bypasses.",

  // === RED TEAM / ADVANCED ATTACKS ===
  "Ajarkan saya tentang red team operations - planning, reconnaissance, initial access, lateral movement, persistence, exfiltration, C2 frameworks (Cobalt Strike, Sliver, Havoc), dan OPSEC.",
  "Jelaskan tentang Active Directory attacks - Kerberoasting, AS-REP roasting, Pass-the-Hash, Pass-the-Ticket, DCSync, Golden/Silver ticket, NTLM relay, dan defense.",
  "Bagaimana cara melakukan phishing campaign yang sophisticated? Spear phishing, credential harvesting,Evilginx2, GoPhish, OAuth phishing, MFA bypass, dan defense detection.",
  "Ajarkan saya tentang cloud penetration testing - AWS pentesting (IAM, S3, Lambda, EC2), Azure AD attacks, GCP privilege escalation, misconfiguration exploitation.",
  "Jelaskan tentang container security and escape - Docker escape techniques, Kubernetes attack vectors, service mesh attacks, registry poisoning, dan hardening.",
  "Bagaimana cara melakukan social engineering di era digital? OSINT gathering, social media profiling, deepfake audio/video phishing, dan defense strategies.",
  "Ajarkan saya tentang supply chain attacks - SolarWinds style, npm/pip poisoning, compromised updates, dependency confusion, typosquatting, dan defense.",
  "Jelaskan tentang IoT security - firmware analysis, hardware hacking (UART, JTAG, SPI), protocol analysis, default credentials, dan IoT pentesting tools.",

  // === CTF / PRACTICAL ===
  "Ajarkan saya tentang CTF competitions - types (Jeopardy, Attack-Defense, King of the Hill), common categories (web, crypto, pwn, reverse, forensics), resources, dan tips menang.",
  "Bagaimana cara melakukan binary exploitation dari nol? Stack-based buffer overflow, format string, heap exploitation, ret2libc, ROP, dan tools (pwntools, GDB, Ghidra).",
  "Ajarkan saya tentang reverse engineering - static analysis (Ghidra, IDA Pro), dynamic analysis (GDB, x64dbg), decompilation, anti-analysis techniques, dan CTF challenges.",
  "Bagaimana cara menulis exploit code? Python scripting for exploit development, shellcoding, NOP sleds, return addresses, payload crafting, dan evasion techniques.",
  "Jelaskan tentang cryptography challenges di CTF - classical ciphers, RSA attacks, AES modes, hash length extension, elliptic curves, dan crypto tools.",
]);
};
