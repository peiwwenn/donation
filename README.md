# donation
1) Repository overview + Team Introduction
Repository Overview
JomDonate – Smart Donation Matching Platform
JomDonate is a cloud-based donation matching platform designed to reduce resource waste by connecting donors with NGOs and communities in need through structured coordination and location-based matching.

Unlike traditional donation systems focused only on food, our platform supports multiple categories including:
- Food Rescue
- Clothes & Essentials
- Electronics
- Pet Supplies

This project was developed as part of a Google technology hackathon, leveraging Firebase and Google Cloud services to build a scalable, real-time, and secure solution.

Team Introduction
We are a multidisciplinary team of Computer Science undergraduates from Monash University, united by a shared passion for technology-driven social impact.

Team name: 404 team name not found

Our team members:
Chan Eunice – Team Leader
Bong Pei Wen – Member
Ong Zi En – Member
Elizabeth Oang – Design Lead

Although we come from different strengths within Computer Science, we collaborate closely across:
- Sustainable development initiatives
- AI-powered community solutions
- Cloud-based scalable systems
- User-centered interface design

With strong foundations in software engineering, cloud computing, and system design, we aim to build technology that solves real-world problems — efficiently, ethically, and sustainably.

2) Project Overview
Problem statement
Resource waste is a growing global issue.

Every day:
- Surplus food, clothes, electronics, and essential items are discarded.
- NGOs and vulnerable communities struggle to access usable resources.
- There is no centralized real-time system to efficiently match donors with recipients across different categories.

This leads to:
- Environmental damage
- Economic inefficiency
- Social inequality
- Usable items ending up in landfills
The problem is not lack of resources — it is lack of efficient distribution.

Besides, the core issue is not the lack of resources, but inefficient coordination between donors and recipients. Donors often:
- Do not know which NGOs need specific items
- Donate without urgency prioritisation
- Experience slow or unclear communication

Meanwhile, NGOs struggle with:
- Managing incoming donations
- Receiving irrelevant or excessive items
- Lack of real-time matching systems
This results in wasted resources and unmet needs.

SDG alignment 
Our solution supports:
1. SDG 2 – Zero Hunger
Improving access to surplus food donations.

2. SDG 12 – Responsible Consumption and Production
Reducing waste and promoting reuse of usable goods.

3. SDG 11 – Sustainable Cities and Communities
Creating a more connected, resource-efficient community network.

Short description of the solution
Smart Resource Rescue is a web-based platform that:
- Allows donors to list surplus items across multiple categories
- Uses AI to automatically categorise donated items
- Matches donations with nearby NGOs using location-based services
- Tracks donation status in real time
- Ensures secure authentication and transparent donation records
By digitizing and centralizing the donation process, we reduce waste and increase redistribution efficiency.

3) Key Features
✅ Multi-category donation system (Food, Clothes, Electronics, Pet Supplies)
✅ Google Authentication (Google Login, Phone OTP)
✅ Real-time donation tracking (Pending → Matched → Completed)
✅ Location-based matching using Google Maps
✅ Donor dashboard with donation history
✅ NGO matching system
✅ Responsive and user-friendly interface
✅ Contact and support form
✅ Scalable Cloud Architecture (Firebase Authentication, Cloud Firestore database, Google Maps API integration)

4) Overview of Technologies used 
Describe Google technologies used
1. Firebase Authentication
- Email & password login
- Google Sign-In
- Phone OTP verification
- Secure user session management

2. Cloud Firestore
- Real-time NoSQL database
- Stores users, donations, organizations
- Live status updates

3. Firebase Hosting
- Secure HTTPS web hosting
- Fast deployment pipeline

4. Google Maps API (Planned Integration)
Google Maps API is planned for future development to enable:
- Location picker for donors
- Proximity-based donation matching
- Interactive map visualization
This feature will allow geographic optimization of resource distribution.

5. Google AI Studio (Planned Integration)
Google AI Studio will be integrated in the next development phase to enable:
- AI-based matching optimization
- Expiry prediction for food items
- Intelligent recommendation system

Other supporting tools / libraries
- HTML5 / CSS3
- Bootstrap
- JavaScript (ES6 modules)
- Git & GitHub
- VS Code
- Canva (presentation design)

5) Implementation Details & Innovation
System architecture
User (Donor / NGO)
        ↓
Frontend (HTML / CSS / JS)
        ↓
Firebase Authentication
        ↓
Cloud Firestore Database
        ↓
Google Maps API
        ↓
Matching Logic
        ↓
Donation Status Updates

Workflow
1️⃣ User registers or logs in
2️⃣ Donor selects donation category
3️⃣ Donation details are submitted
4️⃣ Data stored in Firestore
5️⃣ System uses Google Maps to determine proximity
6️⃣ NGO is matched
7️⃣ Status updates in real-time

Innovation Highlights
- Real-time cloud-based matching
- Multi-category resource redistribution
- Location-aware donation system
- Scalable Firebase architecture
- Secure multi-method authentication
- Clean, accessible UI design

6) Challenges Faced
🔹 OAuth domain mismatch during deployment
🔹 Securing Firebase API keys
🔹 Handling real-time database synchronization
🔹 Managing authentication state across pages
🔹 Integrating Google Maps with dynamic forms
🔹 Ensuring responsive UI across devices

These challenges strengthened our understanding of:
- Cloud security
- Deployment pipelines
- API configuration
- User experience refinement

7) Installation & Setup
Prerequisites
- Node.js installed
- Firebase CLI installed
- Google Cloud project created

Using Terminal (Command Line Setup)
All setup steps below should be executed in terminal (Mac: Terminal)
Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/peiwwenn/donation.git
cd donation

2️⃣ Install dependencies
npm install

3️⃣ Configure Firebase
- Create a Firebase project
- Enable Authentication
- Enable Firestore
- Enable Hosting
- Add Firebase config to firebase.js

4️⃣ Run locally
firebase serve

5️⃣ Deploy
firebase deploy 

8) Future Roadmap
- AI-powered smart matching recommendations
- Expiry prediction for food donations
- NGO verification system
- Donation analytics dashboard
- Automated pickup scheduling
- Integration with local charity networks
- Sustainability impact tracking dashboard

9) Impact Vision
Smart Resource Rescue aims to:
- Reduce landfill waste
- Improve resource accessibility
- Build sustainable communities
- Empower NGOs
- Promote responsible consumption
Technology should not only scale businesses — it should scale impact.