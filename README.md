# Let's Do - Progressive Web App Todo List

A modern, offline-capable Todo list application built with Flask and PWA features. This application allows users to manage their tasks efficiently with the ability to work offline and sync when back online.

## 🌟 Features

- **Progressive Web App (PWA)**
  - Installable on desktop and mobile devices
  - Works offline with service workers
  - Responsive design for all screen sizes
  - App-like experience with standalone mode

- **Core Todo Features**
  - Add new tasks
  - Mark tasks as complete
  - Delete tasks
  - Persistent storage using SQLite
  - Offline synchronization

## 🛠️ Technology Stack

- **Backend**: Flask 3.0.3
- **Database**: SQLite with Flask-SQLAlchemy
- **Frontend**: HTML, CSS, JavaScript
- **PWA Features**: Service Workers, Web App Manifest
- **Additional Libraries**:
  - Flask-WTF 1.2.1 (Form handling)
  - Flask-SQLAlchemy 3.1.1 (Database ORM)
  - WTForms 3.1.2 (Form validation)

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Its-Vaibhav-2005/ToDo.git
   cd ToDo
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to `http://localhost:5000`

### PWA Installation

1. Open the application in a supported browser (Chrome, Edge, etc.)
2. Click the install icon in the address bar or use the browser's menu
3. Follow the prompts to install the application

## 📱 Offline Usage

The application works offline thanks to service workers:
- Tasks can be added, completed, and deleted while offline
- Changes are synchronized when the connection is restored
- The app remains functional without an internet connection

## 🗃️ Database

The application uses SQLite as its database:
- Database file is stored in the `instance` directory
- Schema includes:
  - Task ID (Primary Key)
  - Task description
  - Completion status

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Vaibhav - [GitHub Profile](https://github.com/Its-Vaibhav-2005)

## 🙏 Acknowledgments

- Flask documentation and community
- PWA documentation and best practices
- All contributors and users of the application 