# San Sakay

San Sakay is a digital platform designed to bridge the gap between commuters, drivers, and transport operators by providing real-time ride availability, accurate arrival estimates, and route-based matching.

Our goal is to make commuting in congested cities faster, safer, and more predictable, while helping drivers optimize their trips and transport operators improve service efficiency.

---

## Problem Statement

Daily commuters face three major pain points:

1. **Uncertainty in waiting times** – No clear idea when the next vehicle will arrive.
2. **Route confusion** – Difficulty finding transport that matches their exact pick-up and drop-off points.
3. **Inefficient matching** – Drivers sometimes operate below capacity while commuters wait longer than necessary.

San Sakay addresses these problems by connecting real-time commuter demand with driver availability, supported by route tracking and filtering tools.

---

## Key Features

### Commuter Perspective
- **Transportation Type Filtering** – Filter by bus, jeepney, tricycle, ride-share, etc.
- **Route Filtering** – Show only preferred routes.
- **Optional:** Sort multiple routes by time or cost.
- **Live Vehicle Tracking** – View inbound transportation in real time as well as passenger count.
- **Arrival Time Estimate** – Predictive arrival times based on location and traffic data.

### Driver Perspective
- **Live Passenger Requests** – Shows commuter locations along the route.
- **Directional Routing** – Filter requests by direction (northbound, southbound, etc.).
- **Passenger Count Management** – Update vehicle capacity in real time.
- **Route Toggle** – Switch between active and inactive status when on/off duty.

---

## Limitations / Challenges
- **Security Risks** – Limited identity verification for drivers/passengers.
- **Data Reliability** – Accuracy depends on honest and consistent user reporting.
- **Connectivity Constraints** – Requires stable internet/GPS for real-time updates.

---

## Hackathon Development Scope

For the hackathon, focus will be on MVP (Minimum Viable Product):

- Basic commuter & driver interface
- Route selection & filtering
- Real-time location updates (mock GPS or API)
- Display all available routes (users choose which route to take)
- Estimated time of arrival display (optional)

---

## Targets
- Complete MVP interface and functionality
- Ensure live updates and passenger management
- Enable basic route selection and filtering

---

**Developed as part of a hackathon project to enhance commuting efficiency and safety in urban areas.**

## How to Run

### Prerequisites
Make sure you have the following installed on your machine:

- **Node.js** (v16+ recommended) – [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

---

### Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-folder>

### Installations
npm install react react-dom react-router-dom leaflet leaflet-routing-machine
npm install vite

RUN:

npm run dev

This will launch the app locally. You should see output similar to:

Local:   http://localhost:5173/
Network: use --host to expose