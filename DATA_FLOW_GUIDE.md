# 🔄 ISS Workflow Data Flow

## How Your Workflow Fetches and Returns Data

### 📊 Complete Data Flow

```
1. User clicks "Track ISS & Send Email"
         ↓
2. Component calls Worqhat API with Workflow ID
         ↓
3. Worqhat executes your workflow:
   
   Step 1: REST API Trigger
   ├─ Receives input parameters
   └─ Activates the workflow
         ↓
   Step 2: HTTP Request Node
   ├─ Makes GET request to: https://api.keeptrack.space/v2/sat/25544
   ├─ Receives ISS position data from KeepTrack API
   └─ Stores data for next step
         ↓
   Step 3: Send Mail Node
   ├─ Takes ISS data from previous step
   ├─ Formats email with ISS information
   └─ Sends to: johnthehecker@gmail.com
         ↓
   Step 4: Return Data Node
   ├─ Packages all data
   └─ Returns to your application
         ↓
4. Component receives workflow response
         ↓
5. Component extracts ISS data from response
         ↓
6. Component displays:
   ├─ ISS position (lat, lng, altitude)
   ├─ Orbital parameters (velocity, period, inclination)
   ├─ Workflow execution details
   └─ Email confirmation
```

---

## 🎯 What Gets Fetched from the API

### API Endpoint
```
https://api.keeptrack.space/v2/sat/25544
```

### ISS Data Structure (from KeepTrack API)
```json
{
  "name": "ISS (ZARYA)",
  "id": 25544,
  "lat": 45.1234,        // Current latitude
  "lng": -122.4567,      // Current longitude
  "alt": 408.5,          // Altitude in km
  "velocity": 7.66,      // Velocity in km/s
  "period": 92.8,        // Orbital period in minutes
  "inclination": 51.6,   // Orbital inclination in degrees
  "apogee": 418.2,       // Highest point in orbit
  "perigee": 398.8,      // Lowest point in orbit
  "timestamp": "2025-10-31T00:00:00Z"
}
```

---

## 📥 How the Component Handles the Response

### 1. Workflow Execution
```typescript
const response = await runWorkflow('6075d63f-b858-4af1-8857-cccba66576e4', {
  apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
  recipientEmail: 'johnthehecker@gmail.com',
  satelliteId: '25544',
  satelliteName: 'ISS (International Space Station)'
});
```

### 2. Response Structure
The workflow returns data in this format:
```json
{
  "success": true,
  "data": {
    // ISS data from HTTP Request node
    "httpResponse": { ... },
    // or
    "satelliteData": { ... },
    // or directly in data
    "name": "ISS (ZARYA)",
    "lat": 45.1234,
    ...
  },
  "executionId": "exec_xxxxx"
}
```

### 3. Data Extraction
The component tries multiple paths to extract ISS data:
```typescript
// Try different possible response structures
if (response.data?.httpResponse) {
  extractedIssData = response.data.httpResponse;
} else if (response.data?.satelliteData) {
  extractedIssData = response.data.satelliteData;
} else if (response.data?.data) {
  extractedIssData = response.data.data;
} else if (response.data?.result) {
  extractedIssData = response.data.result;
} else {
  extractedIssData = response.data;
}
```

### 4. Display
The component displays:
- ✅ Workflow execution status
- 📍 Execution ID
- 🛰️ ISS data preview (formatted)
- 📧 Email confirmation
- 📋 Complete JSON response

---

## 🔍 Verification Steps

### Step 1: Check Workflow Execution
When you click "Track ISS & Send Email", you should see:
```
✅ Workflow Completed Successfully
Execution ID: exec_xxxxx
```

### Step 2: Verify Workflow Steps
All 4 steps should show green checkmarks:
```
✅ REST API Trigger - Initiated
🌐 HTTP Request - Fetched ISS data
📧 Send Mail - Email sent to johnthehecker@gmail.com
✅ Return Data - Results returned
```

### Step 3: Check ISS Data
You should see a section titled "ISS Data (Fetched from API)" with:
- Satellite Name: ISS (ZARYA)
- Latitude: XX.XXXX°
- Longitude: XX.XXXX°
- Altitude: XXX.XX km
- Velocity: X.XX km/s
- Orbit Period: XX.XX min
- Inclination: XX.XX°

At the bottom it confirms:
```
✅ Data fetched from: https://api.keeptrack.space/v2/sat/25544
```

### Step 4: Verify Email
Check johnthehecker@gmail.com for an email containing the ISS data

### Step 5: Check Console Logs
Open browser console (F12) to see:
```javascript
Workflow Response: { success: true, data: {...}, executionId: "..." }
Extracted ISS Data: { name: "ISS (ZARYA)", lat: ..., lng: ..., ... }
```

---

## 🧪 Testing the Data Flow

### Test 1: Execute Workflow
```bash
npm run dev
```
Navigate to: `http://localhost:5173/worqhat-test`

Click: "Track ISS & Send Email"

**Expected Result:**
- Workflow executes successfully
- ISS data appears in the preview section
- Complete response shows in JSON format

### Test 2: Verify API Data
Check the "Complete Response" section. You should see the raw data from the KeepTrack API.

### Test 3: Check Email
Open johnthehecker@gmail.com and verify the email contains ISS position data.

---

## 📊 Data Validation

The component validates that data comes from the API by:

1. **Showing the API URL** in the ISS Data Preview section
2. **Logging to console** for debugging
3. **Displaying complete response** so you can verify the source
4. **Showing workflow steps** to confirm HTTP Request executed

---

## 🔧 Troubleshooting Data Flow

### Issue: No ISS Data in Preview

**Check:**
1. Look at "Complete Response" section - is there data?
2. Check browser console for "Extracted ISS Data" log
3. Verify the HTTP Request node in Worqhat is configured correctly

**Solution:**
The component tries multiple paths to extract data. If it's not showing, the data might be in a different structure. Check the console logs to see the actual response structure.

### Issue: Data Structure Different

**Check:**
Look at the "Complete Response" JSON. The ISS data might be nested differently.

**Solution:**
The component already handles multiple structures:
- `response.data.httpResponse`
- `response.data.satelliteData`
- `response.data.data`
- `response.data.result`
- `response.data` (direct)

### Issue: Email Sent but No Data

**Check:**
1. Workflow executed successfully?
2. HTTP Request node fetched data?
3. Return Data node configured?

**Solution:**
Check the workflow in Worqhat dashboard to ensure all nodes are properly connected and configured.

---

## ✅ Confirmation Checklist

After executing the workflow, verify:

- [ ] Workflow status shows "Completed Successfully"
- [ ] Execution ID is displayed
- [ ] All 4 workflow steps show green checkmarks
- [ ] ISS Data Preview section appears
- [ ] Data shows: name, lat, lng, altitude, velocity, etc.
- [ ] API URL is shown: `https://api.keeptrack.space/v2/sat/25544`
- [ ] Complete Response shows full JSON
- [ ] Console logs show "Workflow Response" and "Extracted ISS Data"
- [ ] Email received at johnthehecker@gmail.com

---

## 🎯 Summary

**Your workflow:**
1. ✅ Fetches ISS data from KeepTrack API
2. ✅ Sends email with the data
3. ✅ Returns data to your app
4. ✅ Component displays the data

**The component ensures:**
- Data comes from the API endpoint (not hardcoded)
- Multiple response structures are handled
- Data source is clearly shown
- Complete response is available for verification

---

**Everything is configured to fetch data from the API first, then display it! 🚀**

Test it now at `/worqhat-test` to see the complete data flow in action!
