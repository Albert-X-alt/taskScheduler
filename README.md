# MatrixTask (Task Scheduler)

An intuitive task management and scheduling application based on the **"Important-Urgent"** 2D coordinate system.

---

## 🚀 Overview

**MatrixTask** is a modern task management tool that visualizes the **Eisenhower Matrix** (The Four Quadrants Rule). It moves away from traditional linear to-do lists, allowing users to intuitively plan task priorities by dragging and dropping within a visual 2D coordinate system.

## ✨ Core Features

### 1. Visual Matrix View

* 
**X-axis (Urgency) & Y-axis (Importance):** The origin is at the bottom-left; task cards are distributed across four quadrants based on their weight.


* 
**Smooth Drag-and-Drop:** Drag task nodes with the mouse; releasing them automatically recalculates and saves the corresponding **Urgency** and **Importance** values.


* 
**Real-time Preview:** Adjust sliders while creating a new task to see a "ghost card" preview of its landing spot on the canvas.



### 2. Integrated Calendar View

* 
**Standard Monthly Calendar:** Provides a visual distribution of daily tasks.


* 
**Quick Sorting:** Clicking a specific date automatically lists and sorts all tasks for that day in the sidebar based on "Comprehensive Weight".



### 3. Local-First Data

* 
**Persistence:** Task data is stored via browser `localStorage`, requiring no registration or login to use.


* 
**Data Portability:** Supports exporting all data as a `.json` backup and importing it on any device with one click.



### 4. Modern UI Design

* 
**Efficient Layout:** High-efficiency three-column layout (Left-Center-Right).


* 
**Polished Interface:** Clean UI and smooth animations powered by **Tailwind CSS**.



---

## 🛠 Tech Stack

Currently a Web application, with plans to package it as a standalone Windows (.exe) desktop program.

* 
**Core Framework:** React 18+ & TypeScript 


* 
**Build Tool:** Vite 


* 
**Styling:** Tailwind CSS 


* 
**Icon Library:** Lucide-React 



---

## ⚡ Quick Start

To run this project locally, you need to have **Node.js** (v18+ recommended) installed.

1. **Clone the repository:**
```bash
git clone https://github.com/Albert-X-alt/taskScheduler.git
``` 

```


2. **Enter the project directory:**
```bash
cd taskScheduler
[cite_start]``` [cite: 34, 35]

```


3. **Install dependencies:**
```bash
npm install
npm install lucide-react
``` 




4. **Start the development server:**
```bash
npm run dev
```



Once started, open your browser and visit the address shown in the console (usually `http://localhost:5173`).

---

## 🗺 Roadmap

The following features are planned for future versions based on the design document:

* [x] **Core Business Logic:** Drag-and-drop inverse mapping algorithm for Importance/Urgency.


* [x] **Web UI:** Responsive three-column layout.


* [x] **Data Management:** Local SQLite/JSON data simulation and Import/Export.


* [ ] **Desktop Packaging:** Package the app as a Windows .exe using **Electron** or **Tauri**.


* [ ] **System Tray & Autostart:** Support for silent startup and system tray residency with scheduled bubble notifications.


* [ ] **AI Intelligent Scheduling:** Integrate **Gemini API** to automatically parse natural language for task creation (e.g., "Meeting tomorrow at 3 PM").



---

## 🤝 Contribution & Feedback

If you are interested in this project, feel free to submit an **Issue** to discuss new features or report bugs. **Pull Requests** are also welcome!

Would you like me to help you draft a specific "Contribution Guide" or a more detailed technical explanation for your contributors?