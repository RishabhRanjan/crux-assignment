# CSV Data Visualistion using OpenAI

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Built With](#built-with)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Description

A full-stack project designed to allow users to create informative data visualizations from CSV data. It leverages a large language model to analyze the CSV data and generate graph configurations based on user-provided questions. This web application is built with React (TypeScript) on the frontend and Spring Boot on the backend.

## Features

- **User-Friendly Interface**: Provides an intuitive user interface following the Figma design.
- **CSV Upload**: Allows users to upload CSV files with data they want to visualize.
- **Question Input**: Enables users to enter questions that describe what insights they seek from the data.
- **Graph Visualization**: Generates and displays graphs based on the CSV data and user questions.
- **Feedback**: Add feedbacks to the graphs generated.

## Getting Started

### Prerequisites

Before you get started, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) - JavaScript runtime for the frontend.
- [npm](https://www.npmjs.com/) - Node Package Manager.
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase-downloads.html) - For running the Spring Boot backend.

### Installation

Backend Url - https://github.com/RishabhRanjan/data-visualisation-spring-backend
Follow these steps to set up the project on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/RishabhRanjan/csv-data-visualistation-openai.git
   ```

2. Install frontend dependencies

```bash
 cd frontend
 npm install
```

## Usage

To use the application:

1. Start the spring boot backend
2. Start the React frontend.
3. Open your web browser and navigate to the application.
4. Upload a CSV file and input a question to generate insightful graphs.

## Built With

This project was built using the following technologies and tools:s

- [React (TypeScript)](https://reactjs.org/) - The frontend library.
- [Ant Design](https://ant.design/) - The UI library.
- [Spring Boot](https://spring.io/projects/spring-boot) - The backend framework.
- [OpenAI GPT-4](https://openai.com/gpt-4) - The language model for generating graph configurations.
