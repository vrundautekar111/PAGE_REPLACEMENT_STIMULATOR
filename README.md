# PAGE_REPLACEMENT_STIMULATOR
# Page Replacement Simulator

A web-based **Page Replacement Simulator** developed using **Python and Flask** to demonstrate and visualize important Operating System page replacement algorithms.

The simulator allows users to enter a reference string, select the number of memory frames, and choose a page replacement algorithm. It then simulates the selected algorithm and displays page hits, page faults, hit ratio, fault ratio, and the frame-by-frame replacement process.

## Algorithms Implemented

* **FIFO (First-In, First-Out)** – Replaces the page that has been in memory for the longest time.
* **LRU (Least Recently Used)** – Replaces the page that has not been used for the longest period.
* **Optimal Page Replacement** – Replaces the page that will not be used for the longest time in the future.

## Features

* Interactive and colorful web interface
* Reference string input
* Custom number of memory frames
* FIFO, LRU, and Optimal algorithms
* Page hit and page fault calculation
* Hit ratio and fault ratio
* Step-by-step frame visualization
* Graphical representation of results
* Algorithm explanations
* Responsive user interface

## Technologies Used

* **Python**
* **Flask**
* **HTML5**
* **CSS3**
* **JavaScript**
* **Chart.js**

## Project Purpose

The main purpose of this project is to provide an easy-to-understand visual representation of page replacement algorithms and help students learn how Operating Systems manage memory when a page fault occurs.

## How to Run

1. Clone the repository.
2. Open the project folder in VS Code.
3. Create and activate a Python virtual environment.
4. Install the required dependencies:

```bash
pip install -r requirements.txt
```

5. Run the Flask application:

```bash
python app.py
```

6. Open the application in your browser:

```text
http://127.0.0.1:5000
```

## Learning Outcomes

Through this project, users can understand:

* Virtual memory
* Page faults and page hits
* Page replacement
* FIFO page replacement
* LRU page replacement
* Optimal page replacement
* Memory frame management
* Performance comparison using hit and fault ratios
* Flask-based web application development

