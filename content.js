let autofillData = null;
let filledFields = new Set();
let debounceTimer = null;

chrome.storage.local.get(['predefined', 'custom'], (data) => {
    if (data.predefined) {
        autofillData = data;
        initObserver();
    }
});

function initObserver() {
    processForms();

    const observer = new MutationObserver((mutations, obs) => {
        const questions = document.querySelectorAll("div[role='listitem']");
        if (questions.length > 0) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                processForms();
            }, 1000);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function normalize(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function processForms() {
    if (!autofillData || !autofillData.predefined) return;

    const questions = document.querySelectorAll("div[role='listitem']");
    if (questions.length === 0) return;

    for (const question of questions) {
        const header = question.querySelector('[role="heading"]');
        let rawText = header ? header.innerText : question.innerText;
        let text = normalize(rawText);
        
        // Skip field if it is empty or already filled
        if (!text || filledFields.has(text)) continue;

        const inputElement = question.querySelector("input:not([type='hidden']):not([type='radio']):not([type='checkbox']):not([type='file']), textarea");
        let matched = false;

        // --- PREDEFINED FIELDS ---
        const pre = autofillData.predefined;

        if (text.includes("Reg number") || normalize("roll").includes(text)) {
            matched = tryFillText(inputElement, pre.rollNumber, text, "Roll Number");
        }
        else if (text.includes("name") || normalize("name").includes(text)) {
            matched = tryFillText(inputElement, pre.name, text, "Name");
        }
        else if (text.includes("gender") || normalize("gender").includes(text)) {
            matched = fillRadioButton(question, pre.gender, text, "Gender");
        }
        else if (text.includes("date of birth") || text.includes("dob") || normalize("dob").includes(text)) {
            matched = tryFillText(inputElement, pre.dob, text, "Date of Birth");
        }
        else if (text.includes("current course") || normalize("current course").includes(text)) {
            matched = fillRadioButton(question, pre.course || "B.Tech", text, "Course");
        }
        else if (text.includes("specialization") || normalize("specialization").includes(text)) {
            matched = fillRadioButton(question, pre.specialization || "Computer Science and Engineering", text, "Specialization");
        }
        else if (text.includes("10th") || normalize("10th").includes(text)) {
            matched = tryFillText(inputElement, pre.tenth, text, "10th %");
        }
        else if (text.includes("12th") || normalize("12th").includes(text)) {
            matched = tryFillText(inputElement, pre.twelfth, text, "12th %");
        }
        else if (text.includes("cgpa") || normalize("cgpa").includes(text)) {
            matched = tryFillText(inputElement, pre.cgpa, text, "CGPA");
        }
        else if (text.includes("phone") || text.includes("mobile") || normalize("phone").includes(text)) {
            matched = tryFillText(inputElement, pre.phone, text, "Phone");
        }
        // --- CUSTOM FIELDS ---
        else if (autofillData.custom && Array.isArray(autofillData.custom)) {
            for (const field of autofillData.custom) {
                const customLabel = normalize(field.label);
                const customValue = field.value || "";
                
                // Skip empty custom fields
                if (!customLabel || !customValue.trim()) continue;

                // Bi-directional matching
                if (text.includes(customLabel) || customLabel.includes(text)) {
                    if (inputElement) {
                        matched = tryFillText(inputElement, customValue, text, field.label);
                    } else {
                        matched = fillRadioButton(question, customValue, text, field.label);
                    }
                    if (matched) break;
                }
            }
        }

        if (matched) {
            filledFields.add(text);
        } else {
            console.log(`FormsAutofill: Skipped field [${rawText.trim()}]`);
            // We temporarily add it to filledFields so we don't spam print skipped fields inside the observer loop
            filledFields.add(text); 
        }
    }
}

function tryFillText(inputElement, value, fieldKeyTracker, logLabel) {
    if (!inputElement || !value) return false;
    
    if (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA') {
        fillTextInput(inputElement, value);
        console.log(`FormsAutofill: Matched [${logLabel}] -> Filled text "${value}"`);
        return true;
    }
    return false;
}

function fillTextInput(input, value) {
    if (!input) return;

    input.focus();
    input.value = value;

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function fillRadioButton(questionElement, targetValue, fieldKeyTracker, logLabel) {
    if (!targetValue) return false;

    const targetNorm = normalize(targetValue);
    const options = questionElement.querySelectorAll("div[role='radio']");
    
    for (const option of options) {
        const ariaLabel = option.getAttribute('aria-label');
        const dataValue = option.getAttribute('data-value');
        const innerText = option.innerText;
        
        const optionText = normalize(dataValue || ariaLabel || innerText || "");
        
        if (optionText.includes(targetNorm) || targetNorm.includes(optionText)) {
            if(option.getAttribute('aria-checked') !== 'true') {
                option.click();
            }
            console.log(`FormsAutofill: Matched [${logLabel}] -> Clicked radio option "${targetValue}"`);
            return true;
        }
    }
    return false;
}
