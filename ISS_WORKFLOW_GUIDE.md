# 🛰️ ISS Tracker Workflow - Complete Guide

## 📋 Your Workflow Details

**Purpose**: Fetch ISS position data and send email notification

### Workflow Structure
```
REST API Trigger
       ↓
HTTP Request (Fetch ISS Data)
       ↓
Send Mail (Email to johnthehecker@gmail.com)
       ↓
Return Data
```

### Configuration
- **API Endpoint**: `https://api.keeptrack.space/v2/sat/25544`
- **Satellite**: ISS (International Space Station)
- **NORAD ID**: 25544
- **Email Recipient**: johnthehecker@gmail.com

---

## 🚀 Quick Start

### Step 1: Get Your Workflow ID

1. Go to your Worqhat dashboard
2. Open your ISS tracking workflow
3. Copy the Workflow ID

### Step 2: Run the Workflow

```bash
npm run dev
```

Navigate to: `http://localhost:5173/worqhat-test`

### Step 3: Execute

1. Paste your Workflow ID
2. Click "Track ISS & Send Email"
3. Wait for results

---

## 📊 What the Workflow Does

### 1. **REST API Trigger**
Initiates the workflow when called

### 2. **HTTP Request**
Fetches current ISS data from KeepTrack.space API:
```
GET https://api.keeptrack.space/v2/sat/25544
```

**Returns:**
- Current latitude/longitude
- Altitude
- Velocity
- Orbital parameters
- Timestamp

### 3. **Send Mail**
Sends email to: **johnthehecker@gmail.com**

Email contains:
- ISS position data
- Timestamp
- Orbital information

### 4. **Return Data**
Returns the complete response with ISS data

---

## 💻 Code Usage

### Basic Usage

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function TrackISS() {
  const { runWorkflow, loading } = useWorqhat();

  const trackISS = async () => {
    const result = await runWorkflow('YOUR_WORKFLOW_ID', {
      apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
      recipientEmail: 'johnthehecker@gmail.com',
      satelliteId: '25544',
      satelliteName: 'ISS (International Space Station)'
    });

    if (result.success) {
      console.log('ISS Data:', result.data);
      console.log('Email sent to johnthehecker@gmail.com');
    }
  };

  return (
    <button onClick={trackISS} disabled={loading}>
      Track ISS
    </button>
  );
}
```

### Using the Component

```typescript
import ISSTrackerWorkflow from '@/components/ISSTrackerWorkflow';

function MyPage() {
  return (
    <div>
      <h1>ISS Tracking</h1>
      <ISSTrackerWorkflow />
    </div>
  );
}
```

---

## 📡 ISS Data Structure

The API returns data like this:

```json
{
  "name": "ISS (ZARYA)",
  "id": 25544,
  "lat": 45.123,
  "lng": -122.456,
  "alt": 408.5,
  "velocity": 7.66,
  "period": 92.8,
  "inclination": 51.6,
  "apogee": 418.2,
  "perigee": 398.8,
  "timestamp": "2025-10-31T00:00:00Z"
}
```

### Key Fields

- **lat/lng**: Current position (degrees)
- **alt**: Altitude above Earth (km)
- **velocity**: Orbital velocity (km/s)
- **period**: Orbital period (minutes)
- **inclination**: Orbital inclination (degrees)

---

## 📧 Email Notification

The email sent to **johnthehecker@gmail.com** includes:

- **Subject**: ISS Position Update
- **Content**:
  - Current ISS coordinates
  - Altitude and velocity
  - Timestamp
  - Orbital parameters

---

## 🎯 Use Cases

### 1. Real-time ISS Tracking
```typescript
const trackISSNow = async () => {
  const result = await runWorkflow(workflowId, {
    apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
    recipientEmail: 'johnthehecker@gmail.com',
    satelliteId: '25544'
  });
  
  return result.data;
};
```

### 2. Scheduled Updates
```typescript
// Run every hour
setInterval(async () => {
  await trackISSNow();
}, 3600000); // 1 hour
```

### 3. Alert on Position
```typescript
const checkISSPosition = async () => {
  const result = await runWorkflow(workflowId, {
    apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
    recipientEmail: 'johnthehecker@gmail.com'
  });
  
  if (result.success) {
    const { lat, lng } = result.data;
    
    // Check if ISS is over specific region
    if (lat > 40 && lat < 50 && lng > -130 && lng < -120) {
      console.log('ISS is over the target region!');
    }
  }
};
```

---

## 🔧 Customization

### Change Email Recipient

Edit `src/components/ISSTrackerWorkflow.tsx`:

```typescript
const recipientEmail = 'your-email@example.com';
```

### Track Different Satellite

Change the satellite ID in the API URL:

```typescript
const issApiUrl = 'https://api.keeptrack.space/v2/sat/SATELLITE_ID';
```

**Popular Satellites:**
- ISS: 25544
- Hubble: 20580
- GPS satellites: Various IDs
- Starlink: Various IDs

### Add More Data Processing

```typescript
const processISSData = (data: any) => {
  return {
    position: { lat: data.lat, lng: data.lng },
    altitude: data.alt,
    isOverheadNow: data.lat > 30 && data.lat < 50,
    nextPass: calculateNextPass(data),
  };
};
```

---

## 🧪 Testing

### Test the Workflow

1. Visit `/worqhat-test`
2. Enter your Workflow ID
3. Click "Track ISS & Send Email"
4. Check results panel for ISS data
5. Check email at johnthehecker@gmail.com

### Expected Results

✅ **Success Response:**
```json
{
  "success": true,
  "data": {
    "satelliteData": { ... },
    "emailSent": true,
    "timestamp": "2025-10-31T00:00:00Z"
  },
  "executionId": "exec_123456"
}
```

---

## 📊 Component Features

The `ISSTrackerWorkflow` component includes:

- ✅ **Workflow ID input**
- ✅ **Pre-configured settings** (API URL, email)
- ✅ **Execute button**
- ✅ **Workflow steps visualization**
- ✅ **ISS data preview**
- ✅ **Full response display**
- ✅ **Error handling**

---

## 🐛 Troubleshooting

### Issue: No ISS Data Returned

**Check:**
1. API endpoint is accessible: `https://api.keeptrack.space/v2/sat/25544`
2. Workflow HTTP Request node is configured correctly
3. Network connection is stable

### Issue: Email Not Received

**Check:**
1. Email address is correct: johnthehecker@gmail.com
2. Send Mail node is configured in Worqhat
3. Email credentials are valid
4. Check spam folder

### Issue: Workflow Fails

**Check:**
1. Workflow is active in Worqhat dashboard
2. Workflow ID is correct
3. All nodes are properly connected
4. API key is valid

---

## 📚 API Documentation

### KeepTrack.space API

**Endpoint**: `https://api.keeptrack.space/v2/sat/{NORAD_ID}`

**Method**: GET

**Parameters:**
- `NORAD_ID`: Satellite catalog number (25544 for ISS)

**Response**: JSON with satellite position and orbital data

**Rate Limits**: Check KeepTrack.space documentation

---

## 🎯 Integration Examples

### Example 1: Display ISS on Map

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';
import { useState } from 'react';

function ISSMap() {
  const { runWorkflow } = useWorqhat();
  const [issPosition, setIssPosition] = useState(null);

  const updateISSPosition = async () => {
    const result = await runWorkflow(workflowId, {
      apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
      recipientEmail: 'johnthehecker@gmail.com'
    });

    if (result.success) {
      setIssPosition({
        lat: result.data.lat,
        lng: result.data.lng
      });
    }
  };

  return (
    <div>
      <button onClick={updateISSPosition}>Update ISS Position</button>
      {issPosition && (
        <p>ISS is at: {issPosition.lat}, {issPosition.lng}</p>
      )}
    </div>
  );
}
```

### Example 2: ISS Pass Predictor

```typescript
const predictNextPass = async (userLat: number, userLng: number) => {
  const result = await runWorkflow(workflowId, {
    apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
    recipientEmail: 'johnthehecker@gmail.com'
  });

  if (result.success) {
    const { lat, lng, velocity } = result.data;
    
    // Calculate if ISS will pass over user location
    const distance = calculateDistance(userLat, userLng, lat, lng);
    const timeToPass = distance / velocity;
    
    return {
      willPass: distance < 500, // within 500km
      timeToPass: timeToPass,
      currentPosition: { lat, lng }
    };
  }
};
```

---

## ✅ Checklist

- [ ] Get Workflow ID from Worqhat
- [ ] Test workflow at `/worqhat-test`
- [ ] Verify ISS data is fetched
- [ ] Confirm email is sent to johnthehecker@gmail.com
- [ ] Check response data structure
- [ ] Integrate into your app

---

## 🔗 Resources

- **KeepTrack.space**: https://keeptrack.space/
- **ISS Info**: https://www.nasa.gov/mission_pages/station/main/
- **Worqhat Dashboard**: https://worqhat.com/
- **Test Page**: `/worqhat-test`

---

**Your ISS tracking workflow is ready! 🛰️**

Visit `/worqhat-test` to start tracking the International Space Station!
