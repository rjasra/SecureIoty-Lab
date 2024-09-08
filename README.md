
# SecureIoTy Lab

This project is an interactive network simulator designed to educate students and researchers about computer networks and security. The simulator allows users to create custom networks and interact with pre-defined topologies (pi to pi network).

## Features

1. Drag-and-drop UI for building network topologies (inspired by Cisco Packet Tracer).
2. Pre-defined networks for running security simulations.
3. Real-time interaction with virtual devices via SSH.
4. Security attack simulations, including ICMP ping attacks and more.

## Technology Stack
- Frontend: React.js for the drag-and-drop interface, xterm.js for terminal emulation.
- Backend: VirtualBox for dynamic VM deployment.
- Languages: JavaScript, TypeScript
- Tools: Git, Docker, WebSocket for real-time communication.

## Installation & Setup
1. Clone the Repository

```
git clone https://github.com/rjasra/SecureIoty-Lab
cd network-simulator
```
2. Install Dependencies For the frontend (React app):
```
cd frontend
npm install
```
For the backend:
```
cd backend
pip install -r requirements.txt
```
3. Run the Project Start the backend server:
```
node server.js
```
Start the frontend (React):
```
npm run start
```
4. Access the Application Open your browser and navigate to http://localhost:3000 to access the simulator.

## Screenshots


### Simulator Dashboard
- The image shows an interactive network simulation interface where the topology has been edited by erasing PC5. The "Erase Mode" button is activated, allowing the removal of nodes from the network. 
![image](https://github.com/user-attachments/assets/81fc6b87-790e-40c7-b86e-0f8ab96febd4)

### Pi-to-Pi realtime network
- The image below shows  two Raspberry Pi icons, each opening an SSH-connected terminal. Both terminals display Linux system details and command prompts, allowing simultaneous interaction.
![image](https://github.com/user-attachments/assets/82091d18-840d-46e8-b47c-4b022c3925ba)
