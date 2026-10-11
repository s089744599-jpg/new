// כתובת השרת
const API_URL = 'http://localhost:3001/api';

// פונקציה לטעינת המקצועות מהשרת והצגתם
async function fetchSubjects() {
    const container = document.getElementById('subjects-container');

    try {
        const response = await fetch(`${API_URL}/subjects`);
        
        if (!response.ok) {
            throw new Error(`שגיאה בטעינת הנתונים: ${response.status}`);
        }

        const subjects = await response.json();
        renderSubjects(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
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
        
        // חיבור עתידי לעמוד המקצוע (בהתאם להנחיות האינטגרציה בבלוק 2)
        card.onclick = () => {
            const subjectId = subject.id || subject._id;
            window.location.href = `subject.html?id=${subjectId}`;
        };

        card.innerHTML = `
            <h4>${subject.name || subject.title || 'מקצוע ללא שם'}</h4>
            <p>${subject.description || 'אין תיאור זמין למקצוע זה.'}</p>
        `;

        container.appendChild(card);
    });
}

// הפעלת הטעינה בטעינת העמוד
document.addEventListener('DOMContentLoaded', fetchSubjects);
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
//<<<<<<< HEAD

}
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchResultsContainer = document.getElementById("searchResults");
    
    let allSubjects = [];

    // פניה לשרת לקבלת כלל המקצועות
    async function fetchSubjects() {
        try {
            const response = await fetch("http://localhost:3001/api/subjects");
            if (!response.ok) {
                throw new Error("שגיאה בטעינת הנתונים מהשרת");
            }
            allSubjects = await response.json();
            displayResults(allSubjects);
        } catch (error) {
            console.error("שגיאה:", error);
            searchResultsContainer.innerHTML = "<p style='color: red;'>לא ניתן לטעון את רשימת המקצועות כרגע.</p>";
        }
    }

    // הצגת המקצועות על המסך
    function displayResults(subjects) {
        searchResultsContainer.innerHTML = "";

        if (subjects.length === 0) {
            searchResultsContainer.innerHTML = "<p>לא נמצאו מקצועות התואמים את החיפוש.</p>";
            return;
        }

        subjects.forEach(subject => {
            const card = document.createElement("div");
            card.style.border = "1px solid #ccc";
            card.style.padding = "10px";
            card.style.borderRadius = "5px";
            card.style.maxWidth = "400px";

            card.innerHTML = `
                <h3>${subject.name}</h3>
                <p>${subject.description || "ללא תיאור"}</p>
                <button class="enroll-btn" data-id="${subject.id}" style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    הצטרפות למקצוע
                </button>
            `;

            searchResultsContainer.appendChild(card);
        });
    }

    // סינון בזמן אמת לפי הקלדת המשתמשת
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        const filteredSubjects = allSubjects.filter(subject => 
            subject.name.toLowerCase().includes(searchTerm)
        );

        displayResults(filteredSubjects);
    });

    // הפעלה ראשונית בטעינת העמוד
    fetchSubjects();
});
//=======
//}
//>>>>>>> 6d7d6eb0a001c7d73ea115e04d525f7fe0798745
