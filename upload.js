const API_URL = 'http://localhost:3001/api';

const MAX_SIZE_MB = 5;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'mp3', 'mp4', 'ppt', 'pptx'];

const form = document.getElementById('upload-form');
const subjectSelect = document.getElementById('subject');
const titleInput = document.getElementById('title');
const typeSelect = document.getElementById('type');
const fileInput = document.getElementById('file');
const messageBox = document.getElementById('message');

// טעינת המקצועות לתוך ה-select
async function loadSubjects() {
    try {
        const response = await fetch(`${API_URL}/subjects`);
        if (!response.ok) throw new Error('Request failed');
        const subjects = await response.json();

        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id || subject._id;
            option.textContent = subject.name || subject.title;
            subjectSelect.appendChild(option);
        });
    } catch (error) {
        showMessage('לא הצלחנו לטעון את רשימת המקצועות.', 'error');
    }
}

// הצגת הודעה (success או error)
function showMessage(text, kind) {
    messageBox.textContent = text;
    messageBox.className = kind;
}

// בדיקת תקינות לפני שליחה - מחזירה הודעת שגיאה או null אם הכול תקין
function validateForm() {
    if (!subjectSelect.value) return 'יש לבחור מקצוע.';
    if (!titleInput.value.trim()) return 'יש להזין כותרת.';
    if (!typeSelect.value) return 'יש לבחור סוג חומר.';

    const file = fileInput.files[0];
    if (!file) return 'יש לבחור קובץ.';

    const extension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return `סוג הקובץ לא מותר. הסוגים המותרים: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return `הקובץ גדול מדי. הגודל המקסימלי הוא ${MAX_SIZE_MB}MB.`;
    }

    return null;
}

// שליחת הטופס
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const error = validateForm();
    if (error) {
        showMessage(error, 'error');
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch(`${API_URL}/materials`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Upload failed');

        showMessage('הקובץ הועלה בהצלחה!', 'success');
        form.reset();
    } catch (err) {
        showMessage('ההעלאה נכשלה. נסי שוב.', 'error');
    }
});

document.addEventListener('DOMContentLoaded', loadSubjects);