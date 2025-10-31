# 🚀 Test Your ISS Tracker NOW!

## ✅ Your Workflow ID

```
6075d63f-b858-4af1-8857-cccba66576e4
```

**This is already pre-filled in the component!**

---

## 🎯 Quick Test (2 Steps)

### Step 1: Start Your Server

```bash
npm run dev
```

### Step 2: Open Test Page

```
http://localhost:5173/worqhat-test
```

**That's it!** The Workflow ID is already filled in. Just click **"Track ISS & Send Email"**!

---

## 📊 What Will Happen

1. **Workflow Executes**:
   - REST API Trigger activates
   - HTTP Request fetches ISS data from KeepTrack.space
   - Send Mail sends email to johnthehecker@gmail.com
   - Return Data sends results back

2. **You'll See**:
   - ✅ Workflow Completed Successfully
   - 📍 Execution ID
   - 🛰️ ISS position (latitude, longitude, altitude)
   - 📧 Email confirmation

3. **Email Sent To**:
   - johnthehecker@gmail.com
   - Contains current ISS orbital data

---

## 💻 Test in Code

You can also test directly in your code:

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function TestISS() {
  const { runWorkflow } = useWorqhat();

  const test = async () => {
    const result = await runWorkflow('6075d63f-b858-4af1-8857-cccba66576e4', {
      apiUrl: 'https://api.keeptrack.space/v2/sat/25544',
      recipientEmail: 'johnthehecker@gmail.com',
      satelliteId: '25544',
      satelliteName: 'ISS (International Space Station)'
    });

    console.log('ISS Data:', result.data);
  };

  return <button onClick={test}>Track ISS</button>;
}
```

---

## 🔍 Expected Response

```json
{
  "success": true,
  "data": {
    "name": "ISS (ZARYA)",
    "id": 25544,
    "lat": 45.123,
    "lng": -122.456,
    "alt": 408.5,
    "velocity": 7.66,
    "period": 92.8,
    "inclination": 51.6,
    "timestamp": "2025-10-31T00:00:00Z"
  },
  "executionId": "exec_xxxxx"
}
```

---

## 📧 Check Your Email

After execution, check **johnthehecker@gmail.com** for the ISS position email!

---

## 🎉 You're Ready!

**Your Workflow ID**: `6075d63f-b858-4af1-8857-cccba66576e4`

**Test URL**: `http://localhost:5173/worqhat-test`

**Just run `npm run dev` and click the button!** 🚀
