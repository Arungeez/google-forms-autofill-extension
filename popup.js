document.addEventListener('DOMContentLoaded', () => {
    const predefinedFieldsKeys = ['rollNumber', 'name', 'gender', 'dob', 'course', 'specialization', 'tenth', 'twelfth', 'cgpa', 'phone'];
    const saveBtn = document.getElementById('saveBtn');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const customFieldsContainer = document.getElementById('customFieldsContainer');

    function createCustomFieldRow(labelValue = '', inputValue = '') {
        const row = document.createElement('div');
        row.className = 'custom-field-row';
        
        row.innerHTML = `
            <div class="col">
                <label>Field Name</label>
                <input type="text" class="custom-label" placeholder="e.g. Email" value="${escapeHtml(labelValue)}">
            </div>
            <div class="col">
                <label>Value</label>
                <input type="text" class="custom-value" placeholder="e.g. user@abc.com" value="${escapeHtml(inputValue)}">
            </div>
            <button type="button" class="btn-icon-danger delete-row-btn" title="Remove Field">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;

        row.querySelector('.delete-row-btn').addEventListener('click', () => {
            row.remove();
        });

        customFieldsContainer.appendChild(row);
    }

    function escapeHtml(unsafe) {
        return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    addFieldBtn.addEventListener('click', () => {
        createCustomFieldRow();
    });

    // Load saved data
    chrome.storage.local.get(['predefined', 'custom'], (result) => {
        if (result.predefined) {
            predefinedFieldsKeys.forEach(field => {
                const el = document.getElementById(field);
                if (el && result.predefined[field]) {
                    el.value = result.predefined[field];
                }
            });
        }
        
        if (result.custom && Array.isArray(result.custom)) {
            result.custom.forEach(field => {
                createCustomFieldRow(field.label, field.value);
            });
        }
    });

    // Save data
    saveBtn.addEventListener('click', () => {
        saveBtn.classList.add('btn-loading');
        
        const data = {
            predefined: {},
            custom: []
        };

        // Extract predefined
        predefinedFieldsKeys.forEach(field => {
            const el = document.getElementById(field);
            if (el) {
                data.predefined[field] = el.value;
            }
        });

        // Extract custom
        const rows = customFieldsContainer.querySelectorAll('.custom-field-row');
        rows.forEach(row => {
            const label = row.querySelector('.custom-label').value;
            const value = row.querySelector('.custom-value').value;
            if (label.trim() || value.trim()) {
                data.custom.push({ label: label.trim(), value: value.trim() });
            }
        });

        try {
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    console.error('FormsAutofill: Save failed -', chrome.runtime.lastError);
                    saveBtn.classList.remove('btn-loading');
                } else {
                    window.close(); // Success: auto close popup
                }
            });
        } catch (error) {
            console.error('FormsAutofill: Exception during save -', error);
            saveBtn.classList.remove('btn-loading');
        }
    });
});
