// הכתובת הבסיסית של השרת
const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchSubjects();
});

/**
 * פונקציה הפונה לשרת לקבלת רשימת המקצועות ומציגה אותם על המסך
 */
async function fetchSubjects() {
    const container = document.getElementById('subjects-container');
    
    try {
        const response = await fetch(`${API_BASE_URL}/subjects`);
        
        if (!response.ok) {
            throw new Error('שגיאה בקבלת הנתונים מהשרת');
        }
        
        const subjects = await response.json();
        
        // איפוס אזור ההצגה
        container.innerHTML = '';
        
        if (subjects.length === 0) {
            container.innerHTML = '<p>לא נמצאו מקצועות במערכת.</p>';
            return;
        }
        
        // יצירת כרטיסייה לכל מקצוע
        subjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            
            const title = document.createElement('h3');
            // תמיכה בשמות שדות אפשריים מהשרת (name או title)
            title.textContent = subject.name || subject.title;
            
            const description = document.createElement('p');
            description.textContent = subject.description || 'אין תיאור זמין למקצוע זה.';
            
            card.appendChild(title);
            card.appendChild(description);
            
            // בהמשך האינטגרציה (עם בת 4), כאן תתווסף האפשרות ללחיצה ומעבר לעמוד המקצוע
            
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('שגיאה:', error);
        container.innerHTML = '<p style="color: red;">לא ניתן לטעון את רשימת המקצועות כעת. אנא ודא שהשרת רץ.</p>';
    }
}