# Appointment Scheduler Assistant (Backend)

📍 **Live API:** [https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment](https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment)  
📦 **Repository:** [Appointment-Scheduler-Assistant](https://github.com/amareshwar3/Appointment-Scheduler-Assistant.git)

---

## 🚀 Overview

The **Appointment Scheduler Assistant Backend** is a Node.js + Express-based API that extracts and normalizes appointment details such as **department**, **date**, **time**, and **timezone** from either **text input** or **images** using OCR and natural language parsing. It integrates OCR with **Tesseract.js** for text extraction, performs preprocessing with **Jimp**, and uses **Chrono-node** and **Moment-timezone** to parse and normalize natural language date/time inputs.

---

## 🧠 Tech Stack

- **Backend Framework:** Node.js, Express
- **OCR & Image Processing:** Tesseract.js, Jimp
- **Date-Time Parsing:** Chrono-node, Moment-timezone
- **Keyword Extraction:** Keyword-extractor
- **Middleware:** Multer (file uploads), Body-parser, CORS, Morgan (logging)



## ⚙️ Setup Instructions

### 🧩 Steps to Run Locally

```bash
git clone https://github.com/amareshwar3/Appointment-Scheduler-Assistant.git
cd appointment-scheduler-backend
npm install
npm start # or node server.js
````

Server starts at: 👉 `http://localhost:8080`


---

## 📁 Project Structure

```plaintext
APPOINTMENT-SCHEDULER-BACKEND
│   .env
│   .gitignore
│   eng.traineddata
│   package-lock.json
│   package.json
│   README.md
│   server.js
├───src
│   ├───routes
│   │       combineRoute.js
│   │       entityRoute.js
│   │       normalize.js
│   │       ocrRoute.js
│   └───services
│       entityService.js
│       normalizeService.js
│       ocrService.js
└───uploads
        1760090705276-Screenshot 2025-10-10 114302.png
        1760090757835-Screenshot 2025-10-10 114302.png
        1760090793024-Screenshot 2025-10-10 114302.png
```

---

## 🌍 Live Backend Demo & API Endpoints

The backend runs locally and is exposed via **ngrok**.

**Public URL:** `https://baetylic-anxious-marianna.ngrok-free.dev`
**API Endpoint:** `https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment`

---

## 📡 API Usage

### Endpoint

```plaintext
POST https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment
```

### Description

This endpoint accepts either:

1. A **text input** (JSON body), or
2. An **image file** (Form-Data) — from which OCR will extract text automatically.

---

### 🔹 Example 1: Raw Text (JSON)

**POST Request (raw body):**

```json
{
  "text": "Book dentist tomorrow at 4pm"
}
```

**Content-Type:** `application/json`

**Response:**

```json
{
  "appointment": {
    "department": "dentist",
    "date": "2025-10-15",
    "time": "16:00",
    "tz": "Asia/Kolkata"
  },
  "status": "ok"
}
```

---

### 🔹 Example 2: Form-Data (Image Upload)

**POST Request:**

* **Body → form-data**

  * key: `image` → value: (select image file)

**Response:**

```json
{
  "appointment": {
    "department": "dentist",
    "date": "2025-10-15",
    "time": "16:00",
    "tz": "Asia/Kolkata"
  },
  "status": "ok"
}
```

---

## 🧪 Testing with Postman

1. **Method:** `POST`

2. **URL:** `https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment`

3. **Body:**

   * **Option 1:** Choose **raw → JSON** and paste:

   ```json
   
   { "text": "Book dentist tomorrow at 4pm" }
   ```

   * **Option 2:** Choose **form-data** → key = `image`, value = upload your file.

4. **Click Send** → You’ll get a structured response as shown above.

---

## Notes

* The project uses **Tesseract.js** for OCR — performance depends on image clarity.
* Supports both **JSON text** and **image input**.
* Default timezone normalization: `Asia/Kolkata`.
* Stores uploaded files temporarily in `/uploads`.
* JSON request limit: `2MB` (set in `server.js`).

---

## 🧾 Example curl Commands

### Text Input

```bash
curl -X POST "https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment" \
  -H "Content-Type: application/json" \
  -d '{"text": "Book dentist tomorrow at 4pm"}'
```

### Image Input

```bash
curl -X POST "https://palmiest-len-disposedly.ngrok-free.dev/api/final-appointment" \
  -F "image=@/path/to/image.png"
```


---
## Internal Architecture

                            ┌──────────────┐
                            │  Client/API  │
                            └──────┬───────┘
                                   │
                                   ▼
                        ┌────────────────────┐
                        │   combineRoute.js  │   ← Main API Route
                        └────────┬───────────┘
                                 │
                        ┌────────▼────────┐
                        │    Input Type   │
                        └────────┬────────┘
                                 │
                   ┌────────────▼────────────┐
                   │      Text Input?        │
                   └───────┬────────────┬────┘
                           │            │
                          No           Yes
                           │            │
                           ▼            ▼
                ┌─────────────────┐   [Direct Extraction]
                │  ocrService.js  │
                │ (Image to Text) │
                └────────┬────────┘
                         ▼
              ┌────────────────────────┐
              │    entityService.js    │   ← Extracts department,
              │  (Keyword Extraction)  │      date, time, etc.
              └────────┬───────────────┘
                       ▼
            ┌────────────────────────────┐
            │     normalizeService.js    │   ← Normalizes date/time
            │ (Chrono-node + Timezone)   │      and formats result
            └────────┬───────────────────┘
                     ▼
            ┌────────────────────────────┐
            │  Final Structured Response │
            │  { appointment: { ... } }  │
            └────────────────────────────┘


---

## Example Commit Messages

* `feat: add OCR and entity extraction services`
* `fix: improve time normalization for multiple formats`
* `docs: add complete README with API and setup instructions`

---

## 🎥 Demo Video

📽️ **Watch the live demo on Google Drive:**
▶️ [Click here to view demo](https://drive.google.com/file/d/1gkmOcGRzrxAEzkDo0-UBbAhrGKrK9Qso/view?usp=drive_link)

---
