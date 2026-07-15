# Chapter 4 — Linux & Command Line — Hacker Ki Asli Duniya
### By TWH (Afsar Ali) | Technical White Hat

---

## 📚 Table of Contents

| # | Topic | Jump |
|---|---|---|
| 4.1 | Linux Kya Hai — Windows Se Kyun Alag Hai | [➜ Jao](#-topic-41--linux-kya-hai--windows-se-kyun-alag-hai) |
| 4.2 | Termux — Android Pe Linux — Mobile Hacker Ka Setup | [➜ Jao](#-topic-42--termux--android-pe-linux--mobile-hacker-ka-setup) |
| 4.3 | Terminal Ki Pehli Class — Package, Repository, aur Update | [➜ Jao](#-topic-43--terminal-ki-pehli-class--package-repository-aur-update) |

---
---

okay guys — chapter 4 mein swagat hai.

chapter 2 mein tumne computer ka andar samjha. chapter 3 mein network samjha.

ab ek sawaal — **yeh sab knowledge use kahaan karoge?**

jab tum dekhte ho hacking ke videos — koi banda black screen pe commands type kar raha hai — terminal chal raha hai — numbers aur text ghoom rahe hain —

> **woh Linux hai. aur woh terminal hai.**

yahi chapter 4 ka kaam hai — **Linux aur command line sikhna.** kyunki bina iske — hacking tools use karna possible nahi. yeh chapter tumhara woh foundation hai jiske baad real tools use kar sakte ho.

chalo shuru karte hain.

---
---

## 📌 Topic 4.1 — Linux Kya Hai — Windows Se Kyun Alag Hai

---

### ek sawaal se shuru

tumne apni zindagi mein Windows use kiya hoga — ya phone pe Android. koi baat nahi.

ab socho — jab tum computer on karte ho — woh screen kyun dikhti hai? icons kyun hain? programs kaise chalte hain?

kyunki ek **Operating System** chal raha hai — jo sab manage kar raha hai. (Chapter 2 mein yeh seekha tha)

Windows ek OS hai. macOS ek OS hai. Android ek OS hai.

> **Linux bhi ek OS hai.**

lekin yeh baaki sab se bahut alag hai. aur usi wajah se — **hackers ka sabse pasandida OS hai.**

---

### Linux ki kahani — ek student ne banaya tha

saal tha **1991.**

ek Finnish student tha — **Linus Torvalds.** Helsinki university mein padh raha tha.

us waqt ek OS tha — **UNIX** — bahut powerful, lekin expensive. sirf bade companies afford kar sakti theen.

Linus ko kuch chahiye tha — ek aisa OS jo:
- **free ho**
- **powerful ho**
- **khud modify kar sako**

toh usne khud ek OS ka kernel likha. news groups pe share kiya — "maine ek chhota sa OS banaya hai — koi dekhna chahega?"

log aaye — developers aaye — sab ne milke contribute kiya. yeh OS bada hota gaya.

aaj woh **Linux** hai — aur **duniya ka sabse zyada use hone wala OS** hai.

---

### Linux kahan kahan chal raha hai?

yeh shocking lagega —

| Jagah | Example |
|---|---|
| Servers | Google, Amazon, Facebook ke servers |
| Android phones | Android ka base Linux kernel hai |
| Smart TVs | Samsung, LG |
| Routers | Tumhara ghar ka router |
| Supercomputers | World ke top 500 supercomputers mein se 500 Linux pe hain |
| Space | NASA ke systems |
| Hacking | Kali Linux, Parrot OS |

aur Windows? mostly **personal computers** pe. servers pe Linux hi hota hai.

---

### Linux aur Windows mein fark — asli baat

#### 1. Open Source vs Closed Source

**Windows = Closed Source**
Microsoft ne likha — code chhupa ke rakha — tum dekh nahi sakte andar kya hai.

**Linux = Open Source**
poora code publicly available hai. koi bhi dekh sakta hai, modify kar sakta hai, apna version bana sakta hai.

yahi wajah hai — **hackers ke liye Linux trusted hai.** Windows mein Microsoft kya kar raha hai andar — pata nahi. Linux mein — sab transparent hai.

#### 2. Free vs Paid

Windows = paid (ya pre-installed with laptop cost)
Linux = completely free — hamesha

#### 3. Customization

Windows = jo Microsoft ne diya — wahi chalao
Linux = sab kuch badal sakte ho — desktop se leke core functions tak

#### 4. Terminal = First Class Citizen

Windows mein terminal (CMD/PowerShell) ek add-on tool jaisa lagta hai.
Linux mein **terminal sabse powerful tool hai** — sab kuch terminal se hota hai.

yahi reason hai hackers Linux choose karte hain — terminal pe full control milta hai.

---

### Linux versions — "Distributions"

Linux ka ek interesting feature — **koi bhi apna version bana sakta hai.** in versions ko kehte hain **"Distributions" ya "Distros."**

| Distro | Kiske liye | Famous Kyun |
|---|---|---|
| **Ubuntu** | Beginners ke liye | Easy to use, popular |
| **Kali Linux** | Ethical hackers | Pre-installed 600+ hacking tools |
| **Parrot OS** | Ethical hackers | Kali ka lighter alternative |
| **Debian** | Servers, developers | Stable aur reliable |
| **Arch Linux** | Advanced users | Fully customizable |
| **Fedora** | Developers | Cutting edge features |

**Hamare course ke liye: Kali Linux** — kyunki isme pehle se Nmap, Wireshark, Metasploit, Burp Suite sab installed aata hai.

---

### Linux ka structure — Windows se kaise alag dikhta hai

Windows mein tumne dekha hoga:
```
C:\Users\Afsar\Desktop\file.txt
```

Linux mein:
```
/home/afsar/Desktop/file.txt
```

**Fark:**
- Windows mein drive letters hote hain (C:, D:)
- Linux mein ek **root (/) se sab start hota hai** — ek hi tree

```
/           ← root — sab yahan se shuru hota hai
├── home    ← users ke personal files
├── etc     ← configuration files
├── var     ← logs, temp data
├── bin     ← essential commands (ls, cd, etc.)
├── usr     ← installed programs
└── tmp     ← temporary files
```

---

### Kernel kya hota hai?

Linus ne jo banaya tha woh **kernel** tha — OS ka core.

kernel = hardware aur software ke beech ka translator

```
[Tumhara Program] → [Kernel] → [Hardware (CPU, RAM, Disk)]
```

jab tum koi program chalate ho — woh directly hardware se baat nahi karta — kernel ke through jaata hai. kernel decide karta hai — CPU dega, RAM dega, disk access dega ya nahi.

Linux ka kernel = **Linux Kernel** — aaj bhi Linus Torvalds isko lead karta hai.

---

### Hacking mein Linux kyun?

ab directly baat karte hain —

**1. Tools**
Nmap, Metasploit, Wireshark, Burp Suite, Aircrack-ng, John the Ripper — yeh sab Linux pe natively chalta hai. Windows pe limited version milta hai ya nahi milta.

**2. Scripting**
hacker ek baar ka kaam automate karna chahta hai — Linux pe **bash scripting** se easily possible hai. ek script likh do — 1000 tasks automatically.

**3. Privacy**
Linux pe Microsoft jaise companies ka tracking nahi hota. clean environment milta hai.

**4. Servers Linux pe hain**
tum jis server ko attack ya defend karte ho — woh 90% chance se Linux pe chal raha hai. us OS ko seedha samajhna better hai.

**5. Lightweight**
old hardware pe bhi chal jaata hai. VM (Virtual Machine) mein easily run kar sakte ho.

---

### ek line mein

> **Linux = hacker ka ghar. Terminal = hacker ka hathyaar. Kali Linux = ready-made toolkit.**

---

## 🧠 MCQ Set — Topic 4.1

---

**Q1.** Linux kab aur kisne banaya?

- A) 1985 mein Microsoft ne — Windows ka competitor
- B) 2001 mein Google ne — Android ke liye
- C) 1991 mein Linus Torvalds ne — ek free powerful OS ke liye
- D) 1975 mein IBM ne — mainframe computers ke liye

✅ **Sahi Jawab: C**
> Linus Torvalds, 1991, Helsinki university student — usne free aur open source OS banana chahta tha. wahi Linux bana.

---

**Q2.** "Open Source" ka matlab kya hai?

- A) code publicly available hai — koi bhi dekh, modify, distribute kar sakta hai
- B) internet pe khulle mein accessible hai — login nahi chahiye
- C) free download hota hai — paid features nahi hote
- D) government ne officially open kiya hai use karne ke liye

✅ **Sahi Jawab: A**
> open source = source code sab dekh sakte hain. Linux ka poora code GitHub pe available hai. isi wajah se trusted hai — koi hidden backdoor nahi chhupa sakte.

---

**Q3.** Android phones ka base kya hai?

- A) Windows Mobile — Microsoft ka mobile version
- B) macOS — Apple ka modified version
- C) Java OS — pure Java pe based
- D) Linux Kernel — Android ke neeche Linux chal raha hai

✅ **Sahi Jawab: D**
> Android = Linux kernel pe based. tum jo phone use karte ho — uske andar Linux chal raha hai. isliye Linux duniya ka sabse zyada use hone wala OS hai.

---

**Q4.** Kali Linux specifically kyun banaya gaya?

- A) beginners ke liye — simple interface ke saath
- B) ethical hackers ke liye — 600+ security tools pre-installed hain
- C) servers ke liye — maximum uptime ke liye optimized
- D) gaming ke liye — Windows se better performance

✅ **Sahi Jawab: B**
> Kali = penetration testing distro. Nmap, Metasploit, Wireshark, Burp Suite — sab already installed. ethical hackers ko alag se kuch install nahi karna padta.

---

**Q5.** Linux file system root se kaise shuru hota hai?

- A) `/` se — ek single root se poora tree shuru hota hai
- B) `C:\` se — Windows ki tarah drive letters use karta hai
- C) `home/` se — user ka folder sab se upar hota hai
- D) `kernel/` se — kernel folder root hai

✅ **Sahi Jawab: A**
> Linux mein `/` = root. sab yahan se start hota hai. `/home`, `/etc`, `/bin` — sab `/` ke andar hain. Windows jaisi C:, D: drive system nahi hoti.

---

**Q6.** Kernel ka kya kaam hai?

- A) user interface dikhana — desktop aur icons manage karna
- B) internet connection manage karna — Wi-Fi driver
- C) files save aur open karna — file system manager
- D) hardware aur software ke beech translator — resources manage karna

✅ **Sahi Jawab: D**
> kernel = OS ka core. tumhara program seedha CPU se baat nahi karta — kernel beech mein hota hai. woh decide karta hai RAM kitni milegi, disk access hoga ya nahi.

---

**Q7.** duniya ke top 500 supercomputers mein se kitne Linux pe hain?

- A) lagbhag 50% — baaki Windows pe
- B) lagbhag 75% — kuch UNIX pe bhi
- C) 500 mein se 500 — 100%
- D) sirf 10-15 — mostly proprietary OS pe hain

✅ **Sahi Jawab: C**
> 100% — sab Linux. speed, stability, aur control ke liye Linux unbeatable hai heavy computing mein. Windows yahan exist nahi karta.

---

**Q8.** Linux mein terminal kyun itna important hai?

- A) Linux pe GUI nahi hota — sirf terminal se kaam hota hai
- B) terminal se full system control milta hai — scripts likh sakte ho — GUI se zyada powerful
- C) hacking tools sirf terminal mein dikhte hain — GUI pe invisible hote hain
- D) Linux ka terminal internet se faster connect karta hai — GUI se slow hota hai

✅ **Sahi Jawab: B**
> Linux mein GUI bhi hota hai — lekin terminal most powerful tool hai. ek command se woh kaam ho sakta hai jo GUI mein 10 clicks lagte. automation, scripting — sab terminal se.

---

**Q9.** Ubuntu aur Kali Linux mein kya fark hai?

- A) Ubuntu general purpose hai — Kali ethical hacking ke liye specifically designed hai
- B) Ubuntu paid hai — Kali free hai
- C) Ubuntu Linux pe based hai — Kali Windows pe based hai
- D) dono same hain — sirf naam alag hai branding ke liye

✅ **Sahi Jawab: A**
> Ubuntu = user friendly, general use. Kali = penetration testing focused — pre-loaded security tools ke saath. dono Linux hain — alag purposes ke liye.

---

**Q10.** `/etc` folder mein kya hota hai Linux mein?

- A) executable programs — jo terminal se run karte hain
- B) user ka personal data — documents, downloads
- C) temporary files — reboot pe delete ho jaate hain
- D) system configuration files — network settings, user settings, software configs

✅ **Sahi Jawab: D**
> `/etc` = "et cetera" — lekin actually yahan sare system configuration files hote hain. hackers ke liye interesting folder — misconfigured files = vulnerabilities.

---

**Q11.** Linux servers pe itne zyada kyun use hota hai?

- A) Microsoft ne servers ke liye Windows ban kar diya hai
- B) Linux servers graphically better dikhte hain — clients ko impress karta hai
- C) stable, free, open source, terminal control, lightweight — Windows se zyada reliable servers ke liye
- D) Linux servers only government use karte hain — private companies Windows use karti hain

✅ **Sahi Jawab: C**
> Linux servers = stable (years bina restart), free (no licensing), lightweight (headless run — no GUI), full control (root access). Google, Amazon, Facebook — sab Linux servers pe.

---

**Q12.** "Linux Distribution" (Distro) kya hota hai?

- A) Linux ka paid version — company-specific
- B) Linux kernel pe based ek complete OS package — alag alag purposes ke liye customize kiya gaya
- C) Linux ka geographical distribution — har desh ka alag version
- D) Linux ke hardware drivers — specific manufacturer ke liye

✅ **Sahi Jawab: B**
> distro = Linux kernel + extra software + package manager + desktop environment — ek complete ready-to-use OS. Ubuntu, Kali, Arch — sab alag distros hain ek hi kernel ke upar.

---

**Q13.** ethical hacker ko Linux kyun seekhna chahiye?

- A) employers require karte hain — certification mein Linux compulsory hai
- B) Linux pe gaming better hota hai — hackers gaming karte hain
- C) Linux pe internet faster hota hai — hacking ke liye speed chahiye
- D) hacking tools Linux pe best chalte hain — target servers Linux pe hain — terminal se full control milta hai

✅ **Sahi Jawab: D**
> teen reasons: 1) tools (Nmap, Metasploit) Linux pe native. 2) servers Linux pe — same OS pe testing better. 3) terminal se automation aur control maximum.

---

**Q14.** "bash scripting" kya hoti hai?

- A) commands ka ek sequence file mein likhna — automatically ek ke baad ek execute ho — automation
- B) Linux ka graphical interface — bash = desktop environment
- C) Python ka Linux version — bash = Python ki tarah language hai
- D) network scanning tool — bash = hacking ka ek specific tool

✅ **Sahi Jawab: A**
> bash = shell scripting. ek file mein commands likh do — ek baar run karo — sab automatically execute ho. 1000 files rename karna ho, 100 IPs scan karna ho — script likh do.

---

**Q15.** Linus Torvalds aaj bhi kya karta hai?

- A) Google pe kaam karta hai — Android development lead
- B) Linux ko Microsoft ko bech diya — ab woh manage karta hai
- C) Linux Kernel development lead karta hai — aaj bhi active hai
- D) retired ho gaya — Linux ab community manage karti hai bina uske

✅ **Sahi Jawab: C**
> Linus aaj bhi Linux Kernel ka lead maintainer hai — 30+ saal baad bhi. woh review karta hai contributions, decisions leta hai kernel ke baare mein. legendary figure hai tech mein.

---

## 🎯 Task — Topic 4.1 — Linux Ko Pehli Baar Dekho

**task naam: "Linux ko bina install kiye run karo"**

abhi Linux install nahi karna — pehle sirf dekhna hai. iske liye **Live Boot** ya **Online Terminal** use karo.

---

**Option 1 — Online (Sabse Easy):**

Browser mein jaao:
```
https://bellard.org/jslinux/
```
yahan ek real Linux terminal browser mein hi chal raha hai — kuch install nahi karna.

yeh commands try karo:
```
ls
```
(files list hogi)

```
pwd
```
(abhi tum kahaan ho — path dikhega)

```
uname -a
```
(Linux version aur system info dikhega)

---

**Option 2 — Windows mein WSL (Windows Subsystem for Linux):**

agar Windows 10/11 hai toh —
CMD ya PowerShell mein type karo:
```
wsl --install
```
restart karo — Ubuntu install ho jaayega Windows ke andar.

---

**Observe karo:**
- Terminal mein cursor blinka raha hai — yahan commands type karte hain
- Koi icons nahi, koi mouse clicks nahi — sirf text
- `ls` command se files dikhi? yeh chapter 3 ke `dir` command jaisa hi hai — Linux version

**Socho:**
- yeh screen jo tum dekh rahe ho — koi bhi hacking tool isi terminal mein chalega
- jab tum `uname -a` type kiya — Linux ne apna version bataya — same tarah target server ka version bhi nikaal sakte hain

**tip:** pehli baar terminal dekh ke ajeeb lagta hai — normal hai. har hacker ke saath yahi hua. ek hafte mein yeh ajeeb nahi lagega — natural lagega. bas type karte raho.

---

```
════════════════════════════════════════════════════════
   ✅  TOPIC 4.1 COMPLETE — LINUX KYA HAI
   ⬇️  Neeche hai Topic 4.2
════════════════════════════════════════════════════════
```

---
---

## 📌 Topic 4.2 — Termux — Android Pe Linux — Mobile Hacker Ka Setup

---

so guys — tumne Kali Linux ke baare mein samjh liya. aur yeh bhi samajh gaye honge ki Kali Linux laptop ya PC ke liye hai.

but what if — agar tumhare paas koi bhi laptop ya computer nahi hai? tab kya tum yeh course nahi kar paoge?

nahi mere bhai — yahi toh difference hai tumhare Ahmar bhai ke course aur baaki courses mein.

**agar tumhare paas koi bhi laptop aur PC nahi hai — tab bhi yeh course tum sirf apne mobile se complete kar sakte ho.**

so welcome to Topic 4.2 — **Termux.**

---

### Termux kya hai?

Termux ek app hai jo tumhare Android phone pe Kali Linux jaisa terminal chala deta hai.

ab sawaal yeh hai — **mobile pe Linux terminal possible kaise hota hai?**

yeh sunke tumhe shock lagega —

**Android — jo Google ne banaya hai — woh Linux Kernel ka hi use karke bana hai.**

yaad hai humne abhi Linux ke baare mein padha tha? kernel woh cheez hoti hai jo sab kuch control karti hai — phone ka sabse andar wala hissa.

toh socho — Android ke andar jo kernel hai — **woh wohi kernel hai jo Kali Linux use karta hai, Ubuntu use karta hai.**

same kernel. aur isi wajah se Termux tumhare phone pe Kali Linux jaisa terminal run kar paata hai — kyunki andar se dono ek hi cheez pe chal rahe hain.

> **Linux kitna powerful hai — yeh socho. Google ne bhi usi ke upar apna poora Android bana diya.**

---

### iPhone pe Termux kyun nahi chalta?

yeh baat bhi samjho —

**iOS (iPhone) pe Termux run nahi kar sakte.** kyunki Apple ka kernel alag hai — Linux nahi hai woh. isliye Termux wahan kaam nahi karta.

sirf **Android pe** — kyunki Android = Linux kernel.

---

### ek aur baat — virtual phone pe Termux kyun nahi chalta?

kuch log phone pe ek alag app install karte hain — jaise **vMOS** — jo tumhare phone ke andar ek aur phone bana deta hai. virtual phone.

ab agar tum us virtual phone mein Termux install karo — **woh nahi chalega.**

kyun? kyunki woh ek nakli phone hai — uske paas real Linux kernel nahi hoti. Termux ko real kernel chahiye — jo sirf tumhare asli phone mein hoti hai.

agar tum virtual machine ya virtual phone ke baare mein nahi jaante — koi baat nahi. hum aage detail mein explain karenge. jo jaante hain — unke liye yeh tha.

---

---

### Play Store wala Termux mat lo — yeh important hai

⚠️ **Bahut bada mistake jo log karte hain:**

Google Play Store pe Termux available hai — lekin woh **outdated version** hai. 2020 ke baad se Play Store wala update nahi hua. bahut se packages install nahi honge usme.

> **Hamesha GitHub se download karo — latest official release.**

**Official GitHub Link:**
```
https://github.com/termux/termux-app/releases/latest
```

yahan jaao — `termux-app_v*.*.*.apk` file download karo — install karo.

**(Unknown sources allow karna padega Android settings mein — install ke time phone poochega)**

---

### Termux install karna — step by step

**Step 1 — Download karo:**
```
https://github.com/termux/termux-app/releases/latest
```
latest `.apk` file download karo

**Step 2 — Install karo:**
- Settings → Security → Unknown Sources → Allow
- Downloaded APK pe tap karo → Install

**Step 3 — Pehli baar open karo:**
Termux khulega — ek black screen aayegi — cursor blinka karega —

yeh dikhega:
```
Welcome to Termux!

$
```

`$` ka matlab hai — **Linux ready hai — command type karo.**

---

### ek line mein Termux

> **Termux = tumhara phone ek mini Linux computer ban jaata hai. hacking ka pehla tool — already tumhare pocket mein hai.**

---

## 🧠 MCQ Set — Topic 4.2

---

**Q1.** Termux Android pe kyun kaam karta hai?

- A) Termux ek virtual machine hai — andar Kali Linux install karta hai
- B) Android ke andar Linux kernel hai — Termux usi kernel se seedha baat karta hai
- C) Google ne officially Termux ko Android mein include kiya hai
- D) Termux sirf Samsung phones pe kaam karta hai — special driver hai

✅ **Sahi Jawab: B**
> Android ka kernel = Linux kernel. Termux usi existing kernel se baat karta hai. isliye bina koi alag OS install kiye — real Linux terminal phone pe chal jaata hai.

---

**Q2.** iOS (iPhone) pe Termux kyun nahi chalta?

- A) Apple ne Termux ko App Store se ban kiya hai
- B) iPhone pe storage kam hoti hai — Termux fit nahi hoti
- C) iPhone ka processor alag hota hai — ARM nahi hota
- D) iPhone ka kernel Linux nahi hai — Apple ka XNU kernel hai — Termux uss pe kaam nahi karta

✅ **Sahi Jawab: D**
> Termux Linux kernel pe depend karta hai. Android mein Linux kernel hai — isliye chalta hai. iPhone mein Apple ka XNU kernel hai — Linux nahi — isliye Termux wahan possible nahi.

---

**Q3.** Play Store wala Termux kyun nahi lena chahiye?

- A) 2020 ke baad se update nahi hua — outdated hai — bahut se tools kaam nahi karenge
- B) paid hai — Play Store pe subscription lagta hai
- C) sirf rooted phones pe available hai Play Store pe
- D) Play Store wala Termux virus se infected hai

✅ **Sahi Jawab: A**
> Play Store wala Termux officially abandoned hai — 2020 ke baad koi update nahi aaya. latest aur working version sirf GitHub pe milta hai.

---

**Q4.** Termux ka sahi download link kahan se milega?

- A) termux.com — official website
- B) APKPure ya APKMirror — trusted third party
- C) https://github.com/termux/termux-app/releases/latest — official GitHub
- D) Google Play Store — safest option

✅ **Sahi Jawab: C**
> official GitHub releases page = latest + safe. third party sites pe modified APK ho sakta hai. Play Store outdated hai. GitHub hi sahi jagah hai.

---

**Q5.** vMOS pe Termux kyun nahi chalta?

- A) vMOS mein internet nahi hoti — Termux ko internet chahiye
- B) vMOS ek nakli phone hai — uske paas real Linux kernel nahi hoti — Termux real kernel ke bina kaam nahi karta
- C) vMOS sirf games support karta hai — productivity apps nahi
- D) Termux aur vMOS dono same company ke hain — conflict hota hai

✅ **Sahi Jawab: B**
> Termux ko real Linux kernel chahiye. vMOS ek virtual environment hai — uske andar real kernel nahi hoti. isliye Termux wahan install toh ho sakta hai lekin chalta nahi.

---

**Q6.** Android aur Kali Linux mein kya common hai?

- A) dono ka interface same hai — GNOME desktop
- B) dono sirf laptops pe chalte hain
- C) dono Google ke products hain
- D) dono ka base Linux kernel hai — same kernel jo sab Linux systems use karte hain

✅ **Sahi Jawab: D**
> Android = Linux kernel ke upar bana. Kali = Linux kernel ke upar bana. kernel same hai — upar sab alag hai. yahi wajah hai Termux Android pe Kali jaisa kaam kar sakta hai.

---

**Q7.** Termux install karne ke liye phone root karna zaroori hai?

- A) nahi — Termux bina root ke normal Android phone pe kaam karta hai
- B) haan — root ke bina Linux kernel access nahi milti
- C) sirf pehli baar root chahiye — baad mein nahi
- D) depends karta hai phone brand pe — Samsung mein root chahiye

✅ **Sahi Jawab: A**
> Termux bina root ke kaam karta hai. Android ka Linux kernel already accessible hai normal apps ke liye bhi. root ki zarurat nahi.

---

**Q8.** Termux ko Android pe "mini Linux lab" kyun kaha jaata hai?

- A) Termux mein ek choti si virtual Kali Linux install hoti hai
- B) Termux Android ke upar Windows simulate karta hai
- C) Termux se real Linux commands aur tools phone pe chalte hain — pocket mein poora lab aa jaata hai
- D) Termux sirf Linux documentation padhne ke liye hai

✅ **Sahi Jawab: C**
> Termux mein real Linux environment milta hai — real tools, real commands. koi simulation nahi. pocket mein actual working Linux lab — isliye "mini Linux lab" kehte hain.

---

**Q9.** Termux install karne ke liye phone mein kya allow karna padta hai?

- A) Developer Mode — settings mein se
- B) Root Access — superuser permission
- C) ADB Mode — Android Debug Bridge
- D) Unknown Sources / Install Unknown Apps — kyunki GitHub se APK aa rahi hai, Play Store se nahi

✅ **Sahi Jawab: D**
> GitHub se download ki APK = Play Store ke bahar ki app. Android by default sirf Play Store apps allow karta hai. "Unknown Sources" allow karo — phir install hogi.

---

**Q10.** Termux pehli baar kholne pe kya dikhta hai?

- A) Kali Linux ka purple desktop
- B) ek black screen — `$` cursor — aur "Welcome to Termux!" message
- C) Google ka login page — account connect karna padta hai
- D) settings wizard — language aur region choose karna padta hai

✅ **Sahi Jawab: B**
> Termux = pure terminal. koi GUI nahi, koi icons nahi. black screen, `$` prompt, cursor — bas. yahan se tumhara Linux safar shuru hota hai.

---

**Q11.** is course mein Termux kyun include kiya gaya?

- A) laptop wale students ke liye — PC pe bhi Termux chalti hai
- B) sirf advanced students ke liye — beginners ke liye nahi
- C) taaki jo student laptop afford nahi kar sakte — woh bhi sirf phone se course complete kar sakein
- D) Kali Linux expensive hai — Termux free alternative hai

✅ **Sahi Jawab: C**
> Ahmar bhai ka course sabke liye hai — laptop ho ya na ho. Termux se mobile students bhi same cheezein seekh sakte hain. yahi is course ka fark hai baaki courses se.

---

**Q12.** Android ka kernel konsa hai?

- A) Windows NT Kernel — Microsoft ka
- B) XNU Kernel — Apple ka
- C) Linux Kernel — same jo Kali, Ubuntu use karte hain
- D) Android ka apna custom kernel hai — Linux se alag

✅ **Sahi Jawab: C**
> Android = Linux Kernel. Google ne Linux kernel ke upar apna Android OS banaya. yahi fact Termux ko possible banata hai.

---

**Q13.** Termux aur vMOS mein kya bada fark hai?

- A) Termux paid hai — vMOS free
- B) Termux sirf hacking ke liye — vMOS general purpose
- C) Termux Chinese app hai — vMOS Indian
- D) Termux real phone ke kernel pe seedha kaam karta hai — vMOS ek nakli phone banata hai andar

✅ **Sahi Jawab: D**
> Termux = real kernel, real environment. vMOS = virtual/fake phone inside phone. Termux real tools run karta hai — vMOS mein Termux hi nahi chalta kyunki real kernel access nahi.

---

**Q14.** agar kisi ke paas laptop nahi hai — toh kya woh yeh ethical hacking course kar sakta hai?

- A) nahi — ethical hacking ke liye laptop compulsory hai
- B) haan — sirf Android phone se bhi Termux ke zariye course complete ho sakta hai
- C) half course ho sakta hai — baaki ke liye laptop chahiye
- D) haan — lekin sirf theory — practical ke liye laptop chahiye

✅ **Sahi Jawab: B**
> Termux isi liye hai. poora course — theory bhi, practical bhi — sirf phone se. laptop nahi hai toh koi baat nahi — Termux hai.

---

**Q15.** Termux mein kaunsa `.apk` file download karni chahiye GitHub se?

- A) `termux-tools.apk` — tools package
- B) `termux-full.apk` — complete version
- C) `termux-lite.apk` — lightweight version
- D) `termux-app_v*.apk` — main app file jo releases page pe milti hai

✅ **Sahi Jawab: D**
> GitHub releases page pe `termux-app_v[version].apk` milti hai — yahi download karni hai. version number alag ho sakta hai — lekin file naam ka format yahi hoga.

---

## 🎯 Task — Topic 4.2 — Termux Apne Phone Pe Install Karo

**task naam: "apna pocket Linux lab ready karo"**

bas ek kaam — Termux install karo. commands aage seekhenge.

---

**Step 1 — GitHub pe jaao:**

apne phone ke browser mein yeh link kholo:
```
https://github.com/termux/termux-app/releases/latest
```

---

**Step 2 — APK download karo:**

page pe `termux-app_v*.apk` file dikhegi — usse tap karke download karo.

*(Play Store se bilkul mat lena — woh outdated hai)*

---

**Step 3 — Install karo:**

download hone ke baad —
- phone poochega "Unknown source se install karein?" → Allow karo
- APK pe tap karo → Install

---

**Step 4 — Pehli baar open karo:**

Termux open karo — ek black screen aayegi — kuch seconds mein setup hoga — phir yeh dikhega:

```
Welcome to Termux!

$
```

bas. tumhara Linux terminal ready hai.

**tip:** yeh `$` sign — yahi tumhara naya ghar hai. agle topics mein isi ke saath kaam karenge — commands, tools, sab kuch. abhi sirf install karo aur feel karo ki tumhare phone mein ek poora Linux chal raha hai.
```
════════════════════════════════════════════════════════
   ✅  TOPIC 4.2 COMPLETE — TERMUX SETUP
   ⬇️  Neeche hai Topic 4.3
════════════════════════════════════════════════════════
```

---
---

## 📌 Topic 4.3 — Terminal Ki Pehli Class — Package, Repository, aur Update

---

### pehle ek baat clear karte hain

ab tak tumne yeh seekha —

- Linux kya hota hai (4.1)
- Termux phone pe kaise kaam karta hai (4.2)

ab **actually terminal use karna shuru karte hain.**

aur yahan ek important cheez batana chahta hoon —

> **yeh chapter Termux aur Kali Linux — dono ke liye ek saath hai.**

kyun? kyunki dono Linux ke upar based hain. dono mein bahut si cheezein common hain — same logic, same concepts, sirf kuch jagah commands thodi alag hoti hain.

toh yahan ek explanation — dono ka kaam ho jaayega.

**ab se hum aise chalenge:**

jab bhi koi command sikhayenge — tumhe clearly batayenge:
- 📱 **Termux mein:** yeh command use hogi
- 💻 **Kali Linux mein:** yeh command use hogi

aur jab dono mein same command ho — toh ek baar likhi — dono ke liye valid.

**future mein:** ek alag chapter sirf Termux ke liye hoga — aur ek sirf Kali Linux ke liye. wahan deeper jaayenge. yeh chapter foundation hai — jo cheezein dono mein common hain — woh yahan sikhenge.

ab shuru karte hain — terminal ki pehli asli class se.

---

### terminal mein pehla kaam kya hota hai?

jab tum koi nayi machine setup karte ho — chahe Termux ho ya Kali Linux — **pehla kaam hota hai update aur package management.**

yeh samjhne ke liye pehle ek cheez clearly samajhni padegi —

> **Package kya hota hai?**

---

### Package kya hota hai?

seedha example se samjho —

socho tumhare paas ek naya phone hai. isme default mein WhatsApp nahi hai. tum Play Store pe jaate ho — WhatsApp dhundhte ho — install karte ho.

**yahi process Linux mein bhi hoti hai — lekin terminal se.**

Linux mein **har software, har tool, har program ek "package" hota hai.**

Nmap install karna hai? woh ek package hai.
Python install karna hai? woh ek package hai.
Wireshark chahiye? woh ek package hai.

```
Package = ek bundled software — code + files + dependencies sab ek saath
```

**lekin ek aur cheez samajhni hai — "dependency" kya hoti hai?**

---

### Dependency kya hoti hai?

maan lo tum ek dukaan pe cake order karte ho.

cake banana hai toh:
- maida chahiye
- eggs chahiye
- butter chahiye
- sugar chahiye

yeh sab **ingredients** hain. cake in sab pe depend karta hai.

agar ingredients nahi hain — cake nahi banega.

exactly aisa hi software mein hota hai —

jab tum koi tool install karte ho — maan lo **Nmap** — toh Nmap kuch cheezoon pe depend karta hai. kuch libraries chahiye usse. kuch helper programs chahiye.

```
Nmap install karo
→ pehle uski dependencies install hongi automatically
→ phir Nmap install hoga
```

**acchi baat yeh hai** — Linux ka package manager yeh sab khud karta hai. tumhe alag alag cheezein manually install nahi karni. ek command — aur woh khud dependency dhundhega aur install karega.

> **Package Manager = tumhara automatic assistant — jo software aur uski saari zarooratein khud sambhaal leta hai.**

---

### Package Manager kya hota hai?

Play Store ka kaam kya hai?
- apps dhundho
- ek tap mein install karo
- update available hai toh update karo
- uninstall karo

**Linux ka Package Manager exactly yahi karta hai — terminal se.**

lekin yahan ek interesting cheez hai —

**Termux aur Kali Linux dono alag package managers use karte hain.**

| | 📱 Termux | 💻 Kali Linux |
|---|---|---|
| **Package Manager** | `pkg` | `apt` |
| **Full Name** | Package Manager (Termux's own) | Advanced Package Tool |
| **Command style** | `pkg install [naam]` | `apt install [naam]` |
| **Backend** | APT ke upar hi bana hai | Direct APT |

**ek important baat —**

`pkg` actually `apt` ka hi ek wrapper hai — matlab andar se woh bhi `apt` use karta hai. lekin Termux ke liye simplify kiya gaya hai.

isliye dono mein bahut similarity hai — aur dono ka logic bilkul same hai.

---

### Repository kya hoti hai?

ab ek aur concept — jise samjhe bina package manager adha samajh aata hai.

socho —

Play Store ek **bada warehouse** hai jahan laakhon apps hain. tum app ka naam type karo — woh warehouse mein jaata hai — app dhundhta hai — tumhare phone pe laata hai.

Linux mein isi warehouse ko **Repository** kehte hain.

```
Repository = ek bada online storage jahan hazaron packages hain
             Package Manager wahan jaata hai — package dhundhta hai — tumhare system pe install karta hai
```

📱 **Termux ki apni repository hai** — Termux ke liye specifically maintained packages.

💻 **Kali Linux ki apni repository hai** — Kali ke liye specifically curated packages — including 600+ hacking tools.

```
Tumhara Terminal
     ↓
Package Manager (pkg / apt)
     ↓
Repository (online server)
     ↓
Package download + install
```

yahi pura system hai. ab commands seekhte hain.

---

### Pehla Command — Update karna

yeh **sabse pehla command** hota hai jo har Linux user — beginner se expert tak — kisi bhi system pe chalata hai.

lekin pehle samjho — **"update" ka matlab kya hai?**

---

#### Update vs Upgrade — yeh fark bahut log confuse karte hain

**Update** ka matlab —

> "jaao repository mein dekho — kya kya nayi cheezein available hain — ek list banao"

bas. **koi cheez install nahi hoti.** sirf system ko pata chalta hai ki konse packages ke nayi versions aa gayi hain.

bilkul waise jaise Play Store kholta ho — apps ki list refresh hoti hai — pata chalta hai kitni updates hain — lekin abhi kuch download nahi hua.

**Upgrade** ka matlab —

> "jo list banai thi update mein — ab woh saari nayi versions actually install karo"

yeh actual download + installation karta hai.

```
Update  = list refresh karo (kya available hai)
Upgrade = woh list dekh ke actually install karo
```

ab commands —

---

#### 📱 Termux mein — Update karna

```bash
pkg update
```

yeh command kya karta hai:
1. Termux ki repository se contact karta hai
2. available packages ki latest list laata hai
3. tumhare system ko batata hai — "yeh yeh cheezein update ho sakti hain"

**jab chalao toh kuch aisa dikhega:**

```
Get:1 https://packages-cf.termux.dev/apt/termux-main stable InRelease
Get:2 https://packages-cf.termux.dev/apt/termux-main stable/main aarch64 Packages
Fetched 3,421 kB in 4s (855 kB/s)
Reading package lists... Done
```

iska matlab — repository se list aa gayi. koi installation nahi hui abhi.

---

#### 💻 Kali Linux mein — Update karna

```bash
sudo apt update
```

ya purane style mein:

```bash
sudo apt-get update
```

**`sudo` kya hai?**

`sudo` = **Super User Do** — yani "yeh kaam root (admin) ki permission se karo."

Kali Linux mein system-level kaam karne ke liye permission chahiye — isliye `sudo` lagate hain aage.

Termux mein `sudo` nahi lagata — kyunki Termux already tumhare user space mein chal raha hai — extra permission ki zarurat nahi hoti.

| | 📱 Termux | 💻 Kali Linux |
|---|---|---|
| **Update command** | `pkg update` | `sudo apt update` |
| **sudo ki zarurat** | ❌ Nahi | ✅ Haan |
| **Reason** | Termux apne space mein hai | Kali system-level access chahiye |

**Kali mein update chalane ke baad kuch aisa dikhega:**

```
Hit:1 http://kali.download/kali kali-rolling InRelease
Get:2 http://kali.download/kali kali-rolling/main amd64 Packages [19.9 MB]
Fetched 19.9 MB in 12s (1,659 kB/s)
Reading package lists... Done
```

---

### Upgrade karna — actually install karo

ab update ke baad — **upgrade** —

#### 📱 Termux mein:

```bash
pkg upgrade
```

#### 💻 Kali Linux mein:

```bash
sudo apt upgrade
```

dono mein system poochega — "kya sach mein install karein?" — `Y` dabao aur Enter — installation shuru ho jaayegi.

```
Do you want to continue? [Y/n]  Y
```

---

### Update + Upgrade — ek saath

ek smart shortcut — dono ek hi baar mein —

#### 📱 Termux:

```bash
pkg update && pkg upgrade
```

#### 💻 Kali Linux:

```bash
sudo apt update && sudo apt upgrade
```

`&&` ka matlab — "pehli command successfully complete ho — tab doosri chalao."

---

### Package Install Karna

ab ek specific tool install karna seekhte hain —

maan lo **`curl`** install karna hai — yeh ek tool hai jo URLs se data fetch karta hai —

#### 📱 Termux mein:

```bash
pkg install curl
```

#### 💻 Kali Linux mein:

```bash
sudo apt install curl
```

system poochega `Y/n` — `Y` dabao — install ho jaayega.

**ek aur example — `git` install karna:**

```
📱 Termux:     pkg install git
💻 Kali Linux: sudo apt install git
```

**`python` install karna:**

```
📱 Termux:     pkg install python
💻 Kali Linux: sudo apt install python3
```

pattern dekho — **logic same hai, command thodi different hai.**

---

### Package Remove Karna

koi tool remove karna ho —

#### 📱 Termux:

```bash
pkg uninstall [package-naam]
```

#### 💻 Kali Linux:

```bash
sudo apt remove [package-naam]
```

---

### Package Search Karna — repository mein

agar tum jaanna chahte ho ki koi package available hai ya nahi —

#### 📱 Termux:

```bash
pkg search [naam]

# Example:
pkg search nmap
```

#### 💻 Kali Linux:

```bash
apt search [naam]

# Example:
apt search nmap
```

---

### Installed Packages ki List Dekhna

#### 📱 Termux:

```bash
pkg list-installed
```

#### 💻 Kali Linux:

```bash
apt list --installed
```

---

### Quick Summary Table — Dono Ke Liye

| Kaam | 📱 Termux | 💻 Kali Linux |
|---|---|---|
| Repository update | `pkg update` | `sudo apt update` |
| Sab upgrade karo | `pkg upgrade` | `sudo apt upgrade` |
| Update + Upgrade ek saath | `pkg update && pkg upgrade` | `sudo apt update && sudo apt upgrade` |
| Package install karo | `pkg install [naam]` | `sudo apt install [naam]` |
| Package remove karo | `pkg uninstall [naam]` | `sudo apt remove [naam]` |
| Package search karo | `pkg search [naam]` | `apt search [naam]` |
| Installed list dekho | `pkg list-installed` | `apt list --installed` |

---

### Ek Baar Poora Flow Samjho

naye system pe pehla kaam —

**Step 1:** Pehle repository refresh karo — nayi list aane do
```
📱 pkg update
💻 sudo apt update
```

**Step 2:** Purane packages update karo
```
📱 pkg upgrade
💻 sudo apt upgrade
```

**Step 3:** Jo chahiye woh install karo
```
📱 pkg install [tool-naam]
💻 sudo apt install [tool-naam]
```

yeh teen steps — kisi bhi Linux system pe pehla din aise hi start hota hai. beginner se professional — sab yahi karte hain.

---

### `apt` aur `apt-get` mein kya fark hai?

Kali Linux mein tumne dekha hoga — kuch jagah `apt` likhte hain, kuch jagah `apt-get`.

yeh dono similar hain — lekin ek chhota sa fark hai:

| | `apt-get` | `apt` |
|---|---|---|
| **Kab aaya** | Pehle se hai — purana | Naya — 2014 ke baad |
| **Output** | Plain text — minimal | Better progress bar — user friendly |
| **Scripts mein** | Better — stable output | Interactive ke liye better |
| **Kya use karein** | Dono kaam karte hain | `apt` zyada modern hai |

```bash
sudo apt-get update    # works — purana tarika
sudo apt update        # same kaam, thoda better output
```

beginner ke liye — **`apt` use karo** — zyada clean output milega.

advanced scripts mein `apt-get` ko prefer karte hain — lekin abhi woh stage nahi hai.

---

### Ek Important Cheez — Internet Chahiye

package manager kaam karta hai — **repository se download karke.**

iska matlab — **internet connection zaroori hai** jab bhi:
- `update` karo
- `upgrade` karo
- koi nayi cheez `install` karo

agar internet nahi hai — yeh commands fail hongi. normal baat hai — offline mein kuch install nahi ho sakta.

---

### Common Mistakes — Jo Sab Karte Hain Pehli Baar

**Mistake 1: Update kiye bina seedha install karna**

```bash
pkg install nmap   # bina update kiye — purani list se purana package mil sakta hai
```

**hamesha pehle update karo.**

**Mistake 2: Kali mein `sudo` bhool jaana**

```bash
apt install nmap        # ❌ — permission denied aayega
sudo apt install nmap   # ✅ — sahi tarika
```

**Mistake 3: Installation ke beech mein terminal band karna**

package install ho raha ho — tab terminal band mat karo. aadhaa install hoga — system mein issues aa sakte hain. pura complete hone do.

**Mistake 4: `Y` dabane ki jagah seedha Enter dabana**

jab `[Y/n]` aaye — `Y` type karo phir Enter dabao. seedha Enter bhi usually `Y` maana jaata hai — lekin clearly `Y` type karna better habit hai.

---

### Tumhara First Day Terminal Pe — Exact Sequence

**📱 Agar Termux use kar rahe ho:**

```bash
pkg update
```
→ list refresh hogi — wait karo

```bash
pkg upgrade
```
→ `Y` dabao — updates install hongi — wait karo

```bash
pkg install git
```
→ git install karo — test ke liye

```bash
git --version
```
→ version dikhega — matlab successfully install hua ✅

---

**💻 Agar Kali Linux use kar rahe ho:**

```bash
sudo apt update
```
→ password maangega — apna password daalo — Enter

```bash
sudo apt upgrade
```
→ `Y` dabao — hone do

```bash
sudo apt install git
```
→ git install karo

```bash
git --version
```
→ version confirm karo ✅

---

### ek line mein

> **Package Manager = Linux ka Play Store. `pkg` Termux ka hai, `apt` Kali Linux ka. Pehle update — phir install — yeh order hamesha yaad rakho.**

---

## 🧠 MCQ Set — Topic 4.3

---

**Q1.** Linux mein "Package" kya hota hai?

- A) ek folder jisme commands hote hain — manually copy karo
- B) ek bundled software — code, files aur dependencies ek saath — install karne ke liye ready
- C) internet connection ka naam — Linux mein network ko package kehte hain
- D) ek type ka command — jo sirf root user use kar sakta hai

✅ **Sahi Jawab: B**
> Package = ek complete software bundle. Nmap, Python, Git — sab packages hain. code ke saath uski zarooratein (dependencies) bhi bundled hoti hain. ek command se install ho jaata hai.

---

**Q2.** "Dependency" ka matlab kya hai software mein?

- A) jab ek software dusre software pe depend karta hai — uske bina kaam nahi karta
- B) jab internet slow hoti hai — packages slowly download hote hain
- C) root permission ki zarurat — bina dependency ke install nahi ho sakta
- D) package ka size — bade packages zyada dependent hote hain

✅ **Sahi Jawab: A**
> Dependency = prerequisite. Tool X kaam karne ke liye Library Y chahiye — Y dependency hai. package manager automatically dependencies dhundh ke install karta hai — tumhe manually karna nahi padta.

---

**Q3.** Termux mein package manager konsa hai?

- A) `apt` — Advanced Package Tool
- B) `yum` — Yellowdog Updater Modified
- C) `pkg` — Termux ka apna package manager
- D) `brew` — Homebrew

✅ **Sahi Jawab: C**
> Termux `pkg` use karta hai — jo actually andar se `apt` ka hi wrapper hai lekin Termux ke liye simplify kiya gaya. Kali Linux mein direct `apt` use hota hai.

---

**Q4.** `pkg update` kya karta hai?

- A) sare packages update (install) kar deta hai — latest version
- B) Termux app ko update karta hai — nayi version download karta hai
- C) repository se available packages ki latest list refresh karta hai — koi installation nahi hoti
- D) purane packages delete karta hai — space free karta hai

✅ **Sahi Jawab: C**
> `pkg update` sirf **list refresh karta hai** — "kya kya available hai" yeh pata karta hai. actual installation `pkg upgrade` karta hai. yeh fark bahut important hai.

---

**Q5.** Kali Linux mein `sudo apt update` mein `sudo` kyun lagana padta hai?

- A) `sudo` internet connection ke liye chahiye — bina iske repository accessible nahi
- B) `sudo` Termux aur Kali Linux mein alag kaam karta hai — confusion se bachne ke liye
- C) system-level operations ke liye root/admin permission chahiye — `sudo` woh permission deta hai
- D) `sudo` sirf update command ke saath kaam karta hai — install mein nahi chahiye

✅ **Sahi Jawab: C**
> `sudo` = Super User Do — root privileges se command chalao. Kali Linux mein system modifications ke liye root permission chahiye. Termux mein yeh zarurat nahi kyunki woh already user space mein kaam karta hai.

---

**Q6.** "Repository" kya hoti hai?

- A) ek local folder jahan tumhare installed packages save hote hain
- B) ek online storage jahan packages available hote hain — package manager wahan se download karta hai
- C) terminal ka history — sare purane commands store hote hain
- D) Linux ka configuration file — settings save rehti hain

✅ **Sahi Jawab: B**
> Repository = Play Store jaisa online warehouse. Package manager repository se connect karta hai — package dhundhta hai — tumhare system pe install karta hai. Termux ki alag repository, Kali ki alag.

---

**Q7.** `pkg update && pkg upgrade` mein `&&` ka kya matlab hai?

- A) dono commands simultaneously chalao — parallel execution
- B) ya toh pehla chalao ya doosra — koi bhi ek
- C) pehli command successfully complete ho tab hi doosri chalao
- D) dono commands ko ek hi command mein combine karo — faster execution

✅ **Sahi Jawab: C**
> `&&` = "aur tab" — pehli command success ho (error na aaye) tab hi doosri execute ho. agar `pkg update` fail ho — `pkg upgrade` nahi chalega. yeh bahut useful pattern hai.

---

**Q8.** Kali Linux mein `nmap` install karna ho toh sahi command kya hai?

- A) `pkg install nmap`
- B) `nmap install kali`
- C) `install sudo nmap`
- D) `sudo apt install nmap`

✅ **Sahi Jawab: D**
> Kali Linux mein `sudo apt install [package-naam]` pattern use hota hai. `sudo` pehle, phir `apt`, phir `install`, phir package ka naam. `pkg` sirf Termux mein use hota hai.

---

**Q9.** `apt` aur `apt-get` mein kya fark hai?

- A) `apt-get` Termux ke liye hai — `apt` Kali ke liye
- B) `apt` nayi hai, zyada user-friendly output deti hai — `apt-get` purani hai, scripts mein stable
- C) `apt` sirf update karta hai — `apt-get` sirf install karta hai
- D) dono bilkul alag tools hain — different packages install karte hain

✅ **Sahi Jawab: B**
> `apt` = newer, better progress bar, interactive ke liye. `apt-get` = older, minimal output, scripts mein prefer karte hain stable behavior ke liye. beginners ke liye `apt` better hai.

---

**Q10.** Package install karte waqt `[Y/n]` aata hai — kya matlab hai?

- A) Year (Y) ya No (n) — license agreement accept karo
- B) Yes install karo (Y) ya cancel karo (n) — user ki confirmation chahiye system ko
- C) Yellow mode (Y) ya Normal mode (n) — download speed change hoti hai
- D) yeh sirf Kali mein aata hai — Termux mein nahi

✅ **Sahi Jawab: B**
> System confirm karta hai — "kya sach mein install karoon? space lagegi." `Y` + Enter = haan karo. `n` + Enter = cancel. Enter akela bhi usually `Y` maana jaata hai — lekin clearly `Y` type karna better habit hai.

---

**Q11.** Update kiye bina seedha install kyun nahi karna chahiye?

- A) bina update ke installation fail ho jaati hai — error aata hai hamesha
- B) purani list se purana ya wrong version install ho sakta hai — update se latest list milti hai
- C) bina update ke internet use zyada hoti hai — slow hota hai
- D) update aur install same kaam karte hain — dono ek saath nahi chalate

✅ **Sahi Jawab: B**
> bina `update` ke package manager ke paas purani list hoti hai. latest packages nahi milenge. pehle `update` — phir `install` — yeh correct sequence hai.

---

**Q12.** Termux mein `git` install karne ke baad check kaise karein ki sahi install hua?

- A) `pkg check git` — package manager confirm karega
- B) `git --version` — agar version number aaya toh install hua
- C) `ls git` — installed files dikhenge
- D) `apt verify git` — verification command

✅ **Sahi Jawab: B**
> `[tool-naam] --version` — yeh standard way hai check karne ka. agar tool installed hai — version number print hoga. agar nahi — "command not found" aayega. yeh trick almost sabse kaam karta hai.

---

**Q13.** Termux mein koi package search karna ho — available hai ya nahi — command kya hogi?

- A) `pkg find [naam]`
- B) `apt search [naam]`
- C) `pkg search [naam]`
- D) `search pkg [naam]`

✅ **Sahi Jawab: C**
> Termux mein `pkg search [naam]` — repository mein matching packages dhundhta hai. Kali Linux mein same kaam `apt search [naam]` karta hai. pattern same — tool alag.

---

**Q14.** Package install ke waqt terminal beech mein band kar diya — kya ho sakta hai?

- A) installation automatically resume hogi jab dobara khologe
- B) koi problem nahi — package later install ho jaayega
- C) package partially install ho sakta hai — system mein issues aa sakte hain
- D) Termux automatically undo kar deta hai — safe hai

✅ **Sahi Jawab: C**
> beech mein terminal band karna dangerous hai installation ke dauran. package half installed rehta hai — commands kaam nahi karti — system unstable ho sakta hai. **hamesha complete hone do.**

---

**Q15.** Yeh chapter Termux aur Kali Linux dono ko ek saath kyun cover kar raha hai?

- A) dono same application hain — sirf naam alag hai
- B) dono Linux ke upar based hain — concepts same hain — sirf commands thodi jagah alag hain
- C) Termux actually Kali Linux ka mobile version hai
- D) dono ke liye alag alag chapters banane mein time lagta — isliye combine kiya

✅ **Sahi Jawab: B**
> Termux aur Kali Linux dono Linux kernel pe based hain — isliye fundamentals same hain. package management ka logic, repository ka concept, commands ka pattern — sab same. sirf `pkg` vs `apt` aur `sudo` ka fark hai. ek explanation — dono ka kaam.

---

## 🎯 Task — Topic 4.3 — Pehla Real Command Chalao

**task naam: "apna system update karo aur pehla package install karo"**

---

### 📱 Agar Termux use kar rahe ho:

**Step 1 — Repository update karo:**
```bash
pkg update
```
list aayegi — wait karo poori aane do.

**Step 2 — Upgrade karo:**
```bash
pkg upgrade
```
`Y` dabao — Enter — sab install hone do. patience rakho.

**Step 3 — Pehla tool install karo:**
```bash
pkg install curl
```
`Y` dabao — install hone do.

**Step 4 — Verify karo:**
```bash
curl --version
```
agar version number aaya — successfully install hua. 🎉

**Step 5 — Ek aur try karo:**
```bash
pkg install git
git --version
```

---

### 💻 Agar Kali Linux use kar rahe ho:

**Step 1 — Repository update karo:**
```bash
sudo apt update
```
password maangega — type karo (screen pe nahi dikhega — normal hai) — Enter.

**Step 2 — Upgrade karo:**
```bash
sudo apt upgrade
```
`Y` dabao — hone do.

**Step 3 — Tool install karo:**
```bash
sudo apt install curl
```

**Step 4 — Verify karo:**
```bash
curl --version
```

**Step 5 — Ek aur:**
```bash
sudo apt install git
git --version
```

---

**Observe karo:**
- terminal mein text scroll hua — system kaam kar raha tha
- download speed dikhta hai — real time mein
- version confirm hua — tumne pehla tool successfully install kiya

**Yaad rakho:**
- `pkg` = Termux
- `apt` = Kali Linux
- `sudo` = Kali mein permission ke liye — Termux mein nahi chahiye
- pehle update — phir install — yeh order mat todna

```
════════════════════════════════════════════════════════
   ✅  TOPIC 4.3 COMPLETE — PACKAGE MANAGER & UPDATE
   🎉  CHAPTER 4 COMPLETE — LINUX & COMMAND LINE
   ⬇️  Agle Chapter mein milenge
════════════════════════════════════════════════════════
```

---
