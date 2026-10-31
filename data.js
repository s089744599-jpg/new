// כתובת השרת
const API_URL = 'http://localhost:3001/api';

// פונקציה לטעינת המקצועות מהשרת והצגתם
async function fetchSubjects() {
    const container = document.getElementById('subjects-container');

    // 1. הצגת הודעת "טוען..." בזמן שהמקצועות נטענים מהשרת
    container.innerHTML = '<p class="loading">טוען מקצועות, אנא המתן...</p>';

    try {
        const response = await fetch(`${API_URL}/subjects`);
        
        if (!response.ok) {
            throw new Error(`שגיאה בטעינת הנתונים: ${response.status}`);
        }

        const subjects = await response.json();
        renderSubjects(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        // 2. הודעת שגיאה ידידותית אם הפנייה נכשלה
        container.innerHTML = `<p class="error-message">אירעה שגיאה בטעינת המקצועות. נא לוודא שהשרת פועל בכתובת http://localhost:3001</p>`;
    }
}

// פונקציה להצגת כרטיסיות המקצועות במסך
function renderSubjects(subjects) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';

    if (!subjects || subjects.length === 0) {
        container.innerHTML = '<p class="loading">לא נמצאו מקצועות לימוד.</p>';
        return;
    }

    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        
        // חיבור לעמוד המקצוע
        card.onclick = () => {
            const subjectId = subject.id || subject._id;
            window.location.href = `subject.html?id=${subjectId}`;
        };

        // 3. הצגת שם המורה האחראית בכל כרטיסיית מקצוע (דרישה חובה לבת 1)
        card.innerHTML = `
            <h4>${subject.name || subject.title || 'מקצוע ללא שם'}</h4>
            <p><strong>מורה אחראית:</strong> ${subject.teacher || 'לאצן מוגדר'}</p>
            <p>${subject.description || 'אין תיאור זמין למקצוע זה.'}</p>
        `;

        container.appendChild(card);
    });
}

// הפעלת הטעינה בטעינת העמוד
document.addEventListener('DOMContentLoaded', fetchSubjects);