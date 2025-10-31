# 🔑 How to Get Your Workflow ID

## Step-by-Step Guide

### Method 1: From Workflow Dashboard (Recommended)

1. **Open your Worqhat dashboard** (you're already there!)
   - URL: `https://indigo-condor-375.worqhat.app/workflows`

2. **Click on your workflow** named "WorkFlow" (Status: Active)
   - It's the one shown in your workflows list

3. **Look for the Workflow ID**
   - It should be displayed in the workflow details
   - Usually in the format: `wf_xxxxxxxxxxxxx` or similar
   - Or it might be in the URL when you open the workflow

4. **Copy the Workflow ID**
   - Copy the entire ID
   - You'll paste this into the app

### Method 2: From Workflow URL

When you click on your workflow, the URL might look like:
```
https://indigo-condor-375.worqhat.app/workflows/YOUR_WORKFLOW_ID
```

The part after `/workflows/` is your Workflow ID.

### Method 3: From Workflow Settings

1. Click on your "WorkFlow" 
2. Look for Settings or Details
3. Find "Workflow ID" or "ID" field
4. Copy the value

---

## ⚠️ Important Notes

- Your workflow is **Active** ✅ (shown in green)
- Last updated: Oct 31, 2025
- Make sure to copy the complete ID

---

## 🎯 What to Do Next

Once you have your Workflow ID:

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Open the test page**:
   ```
   http://localhost:5173/worqhat-test
   ```

3. **Paste your Workflow ID** in the input field

4. **Click "Track ISS & Send Email"**

5. **Results will show**:
   - ISS position data
   - Email confirmation
   - Workflow execution details

---

## 📋 Your Workflow Details

From your screenshot:

- **Name**: WorkFlow
- **Status**: Active ✅
- **Last Updated**: Oct 31, 2025
- **Platform**: Indigo Condor 375

### What Your Workflow Does:

1. **REST API Trigger** - Starts the workflow
2. **HTTP Request** - Fetches ISS data from `https://api.keeptrack.space/v2/sat/25544`
3. **Send Mail** - Sends email to `johnthehecker@gmail.com`
4. **Return Data** - Returns ISS position data

---

## 🔧 Troubleshooting

### Can't Find Workflow ID?

Try these:

1. **Click the edit icon** (pencil) next to your workflow
2. **Check the URL** in your browser
3. **Look in workflow settings**
4. **Check workflow details panel**

### Still Can't Find It?

The Workflow ID might be:
- In the workflow editor view
- In the API settings
- In the workflow configuration
- Shown when you click on the workflow name

---

## 💡 Quick Test

Once you have the Workflow ID, test it immediately:

```typescript
// In browser console at /worqhat-test
const workflowId = 'YOUR_WORKFLOW_ID_HERE';

// The component will use it to:
// 1. Fetch ISS data
// 2. Send email to johnthehecker@gmail.com
// 3. Return results
```

---

## ✅ Next Steps

1. [ ] Click on "WorkFlow" in your dashboard
2. [ ] Find and copy the Workflow ID
3. [ ] Run `npm run dev`
4. [ ] Go to `/worqhat-test`
5. [ ] Paste Workflow ID
6. [ ] Click "Track ISS & Send Email"
7. [ ] Check results!

---

**Need help?** Check the workflow details page for the ID, or look in the URL when you open the workflow.
