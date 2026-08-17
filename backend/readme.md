# AI-Assisted Threat Detection Dashboard

## Overview

The **AI-Assisted Threat Detection Dashboard** is a cybersecurity analytics platform that automates the collection, processing, enrichment, and analysis of security-related data. The project integrates multiple cybersecurity datasets, enriches threat information, maps attacks to the MITRE ATT&CK framework, engineers analytical features, stores processed data in MongoDB, and exposes REST APIs for visualization through a dashboard.

The primary objective is to provide security analysts with a centralized platform for monitoring assets, vulnerabilities, threats, incidents, and overall organizational risk.

---

# Features

* Automated Data Collection
* Data Cleaning and Preprocessing
* Threat Intelligence Enrichment
* MITRE ATT&CK Mapping
* Feature Engineering
* MongoDB Database Integration
* RESTful APIs using Flask
* Dashboard Analytics
* Risk Scoring
* Asset Risk Categorization
* CSV Output Generation
* Modular Project Architecture

---

# Technologies Used

## Backend

* Python 3.10+
* Flask
* Pandas
* NumPy
* PyMongo

## Database

* MongoDB

## Data Processing

* Pandas
* NumPy

## API

* Flask REST APIs

## Logging

* Python Logging Module

---

# Project Structure

```text
backend/
│
├── app.py
├── config.py
├── requirements.txt
│
├── data/
│   ├── assets.csv
│   ├── vulnerabilities.csv
│   ├── security_events.csv
│   ├── incident_history.csv
│   ├── threat_intelligence.csv
│   └── mitre_attack_mapping.csv
│
├── preprocessing/
│   ├── __init__.py
│   ├── data_collection.py
│   ├── data_cleaning.py
│   ├── threat_enrichment.py
│   ├── mitre_mapping.py
│   └── feature_engineering.py
│
├── database/
│   ├── __init__.py
│   ├── mongodb.py
│   ├── insert_data.py
│   └── queries.py
│
├── models/
│   ├── asset_model.py
│   ├── vulnerability_model.py
│   ├── threat_model.py
│   ├── security_event_model.py
│   ├── incident_model.py
│   └── mitre_model.py
│
├── services/
│   ├── pipeline_service.py
│   ├── enrichment_service.py
│   ├── mitre_service.py
│   ├── analytics_service.py
│   └── feature_service.py
│
├── routes/
│   ├── assets.py
│   ├── vulnerabilities.py
│   ├── threats.py
│   ├── incidents.py
│   ├── analytics.py
│   └── dashboard.py
│
├── utils/
│   ├── constants.py
│   ├── helper.py
│   ├── logger.py
│   └── validators.py
│
├── outputs/
│   ├── cleaned_data.csv
│   ├── enriched_data.csv
│   ├── mapped_data.csv
│   └── engineered_features.csv
│
└── logs/
    └── application.log
```

---

# Workflow

The complete pipeline follows these stages:

```
CSV Datasets
      │
      ▼
Data Collection
      │
      ▼
Data Cleaning
      │
      ▼
Threat Enrichment
      │
      ▼
MITRE ATT&CK Mapping
      │
      ▼
Feature Engineering
      │
      ▼
MongoDB Storage
      │
      ▼
REST APIs
      │
      ▼
Threat Detection Dashboard
```

---

# Pipeline Description

## 1. Data Collection

The system loads cybersecurity datasets from the `data` directory.

Datasets include:

* Assets
* Vulnerabilities
* Security Events
* Incident History
* Threat Intelligence
* MITRE ATT&CK Mapping

---

## 2. Data Cleaning

The cleaning process performs:

* Removing duplicate records
* Removing empty rows
* Handling missing values
* Standardizing column names
* Normalizing severity values
* Converting timestamps
* Removing duplicate columns

The cleaned dataset is exported as:

```
outputs/cleaned_data.csv
```

---

## 3. Threat Enrichment

Threat enrichment combines security events with:

* Vulnerabilities
* Threat Intelligence

Additional information generated includes:

* Threat Score
* Risk Level
* IOC Match
* Known Exploit Status
* Enrichment Status

Output:

```
outputs/enriched_data.csv
```

---

## 4. MITRE ATT&CK Mapping

Each attack is mapped to the MITRE ATT&CK framework.

Generated fields include:

* Technique ID
* Technique Name
* Tactic
* MITRE Mapping Status
* MITRE Score

Output:

```
outputs/mapped_data.csv
```

---

## 5. Feature Engineering

The system generates features such as:

* Threat Score
* CVSS Score
* Incident Frequency
* Historical Risk
* Patch Age
* Asset Risk Score
* Overall Risk Score
* Risk Category

Output:

```
outputs/engineered_features.csv
```

---

# MongoDB Collections

The processed datasets are stored in MongoDB.

Collections include:

```
assets

vulnerabilities

security_events

incident_history

threat_intelligence

mitre_mapping

enriched_events

mapped_events

engineered_features
```

---

# REST APIs

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | /                    | Home Page                    |
| GET    | /health              | Application Health           |
| GET    | /api/assets          | Retrieve Assets              |
| GET    | /api/vulnerabilities | Retrieve Vulnerabilities     |
| GET    | /api/threats         | Retrieve Threat Intelligence |
| GET    | /api/incidents       | Retrieve Incidents           |
| GET    | /api/analytics       | Dashboard Analytics          |
| GET    | /api/dashboard       | Dashboard Data               |
| GET    | /api/pipeline/run    | Execute Complete Pipeline    |

---

# Feature Engineering

The final engineered dataset contains features including:

* Asset ID
* Threat Score
* CVSS Score
* Incident Frequency
* Historical Risk
* Asset Risk Score
* Overall Risk Score
* Risk Category
* MITRE Technique ID
* MITRE Tactic

These features can be directly used for:

* Dashboards
* Machine Learning
* Risk Analysis
* Threat Hunting
* Predictive Analytics

---

# Logging

The application maintains logs inside:

```
logs/application.log
```

Logged events include:

* Application Startup
* MongoDB Connection
* Data Collection
* Data Cleaning
* Threat Enrichment
* MITRE Mapping
* Feature Engineering
* Database Storage
* API Requests
* Errors and Exceptions

---

# Outputs

During execution, the pipeline automatically generates:

```
outputs/
│
├── cleaned_data.csv
├── enriched_data.csv
├── mapped_data.csv
└── engineered_features.csv
```

These files help validate each stage of preprocessing before storage in MongoDB.

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# MongoDB Configuration

Update `config.py`:

```python
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "ThreatDetectionDB"
```

Start MongoDB before running the application.

---

# Running the Project

Start the Flask application:

```bash
python app.py
```

The backend server starts at:

```
http://127.0.0.1:5000
```

---

# Running the Complete Pipeline

The complete pipeline can also be executed using:

```bash
python services/pipeline_service.py
```

---

# Expected Pipeline Output

```
Loading Datasets...

Cleaning Datasets...

Threat Enrichment Completed

MITRE Mapping Completed

Feature Engineering Completed

MongoDB Storage Completed

Pipeline Finished Successfully
```

---

# Learning Outcomes

This project demonstrates practical implementation of:

* Cybersecurity Data Analytics
* Data Engineering
* Threat Intelligence
* MITRE ATT&CK Framework
* Feature Engineering
* MongoDB Integration
* REST API Development
* Flask Backend Development
* Data Preprocessing
* Security Dashboard Design




## MongoDB setup (required)

The current version uses MongoDB as the real persistence layer. On first backend startup, the bundled CSV datasets are automatically imported into `ThreatDetectionDB` when the collections are empty.

Collections created from the bundled data:
- `security_events` (1,800 records)
- `assets`
- `vulnerabilities`
- `incident_history`
- `threat_intelligence`
- `mitre_mapping`

The AI prediction repository also uses the same database for `threat_predictions`.

### Local MongoDB
Install MongoDB Community Server and MongoDB Compass, make sure the MongoDB service is running, then start Flask. The default URI is `mongodb://127.0.0.1:27017/`.

### MongoDB Atlas
Copy `.env.example` to `.env` and set `MONGO_URI` to your Atlas connection string. Keep `DATABASE_NAME=ThreatDetectionDB`. Never commit `.env` to GitHub.

### Verify persistence
After starting Flask, open:
- `GET http://127.0.0.1:5000/health`
- `GET http://127.0.0.1:5000/api/database/status`

The database status endpoint returns the MongoDB database name and document count for every collection.

To manually re-seed the six bundled source collections:
```powershell
python database/seed_mongodb.py
```
To replace those collections with the CSV snapshot:
```powershell
python database/seed_mongodb.py --force
```
