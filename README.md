# Google Forms Autofill Extension

A Chrome extension that automatically fills predefined data into Google Forms, saving time and reducing manual data entry.

## Features

- 🚀 **Quick Autofill** - Automatically populate form fields with predefined data
- 💾 **Data Storage** - Save and manage custom autofill templates
- 🔄 **Real-time Detection** - Detects new forms dynamically as they load
- 🎯 **Smart Matching** - Intelligently matches field names with predefined data
- 🧹 **Debounced Processing** - Optimized performance with debounced form processing

## Installation

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/Arungeez/google-forms-autofill-extension.git
   cd google-forms-autofill-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (top right corner)

4. Click **Load unpacked** and select the project folder

### From Chrome Web Store
_Coming soon_

## Usage

1. Click the **FormsAutofill** extension icon in your Chrome toolbar
2. Fill in your personal details in the popup:
   - University Roll Number
   - Full Name
   - Email
   - Phone Number
   - Department
   - Semester/Year
3. Add any custom fields you need
4. Click **Save Data**
5. Navigate to a Google Form - it will automatically fill matching fields!

## Project Structure

```
.
├── manifest.json      # Extension configuration
├── content.js         # Content script that runs on Google Forms
├── popup.html         # Popup UI
├── popup.js           # Popup functionality
├── popup.css          # Popup styling
└── README.md          # This file
```

## Technical Stack

- **Manifest Version:** 3 (Manifest V3)
- **Language:** Vanilla JavaScript (ES6+)
- **Storage:** Chrome Storage API
- **UI:** HTML5 + CSS3 with Google Fonts

## How It Works

1. **Content Script** runs on all Google Forms pages
2. **Mutation Observer** detects when new form fields appear
3. **Field Matching** normalizes text and matches with predefined data
4. **Auto-fill** populates matching fields automatically

## Files Overview

### `manifest.json`
Defines extension configuration, permissions, and content script settings.

### `content.js`
The main content script that:
- Retrieves stored autofill data
- Observes DOM changes
- Processes and fills form fields
- Normalizes text for accurate matching

### `popup.html`
User interface for configuring autofill data with fields for:
- Personal Details (Roll Number, Name, Email, Phone)
- University Information (Department, Semester/Year)
- Custom Fields

### `popup.js`
Handles:
- Form submission and data persistence
- Chrome Storage API interactions
- UI event listeners

### `popup.css`
Modern styling with:
- Plus Jakarta Sans font
- Glow effects and animations
- Responsive design

## Permissions

- `storage` - To save and retrieve autofill data
- `https://docs.google.com/forms/*` - To access Google Forms

## Development

### Adding New Fields
1. Edit `popup.html` to add new input fields
2. Update field IDs in `popup.js` to save to storage
3. Update `content.js` field matching logic

### Testing
1. Load the unpacked extension in Chrome
2. Open a Google Form
3. Configure your data in the popup
4. Refresh the form page and verify autofill works

## Known Limitations

- Only works on `docs.google.com/forms/` URLs
- Field matching is based on normalized text comparison
- Some forms with custom JavaScript may not be fully compatible

## Future Enhancements

- [ ] Multiple profiles/templates
- [ ] Import/Export functionality
- [ ] Keyboard shortcuts
- [ ] Form field exclusion list
- [ ] Sync across devices

## Troubleshooting

**Extension not working?**
- Ensure you're on a Google Form page
- Check that data is saved in the popup
- Verify the extension has permission for the page
- Try refreshing the form page

**Fields not filling?**
- Field names must match (case-insensitive)
- Try using simpler field labels
- Check browser console for errors (F12)

## License

MIT

## Author

[Arungeez](https://github.com/Arungeez)

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.
