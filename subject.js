document.addEventListener('DOMContentLoaded', () => {
    // זיהוי ה-subjectId מתוך כתובת ה-URL (לדוגמה: subject.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get('id');

    if (!subjectId) {
        document.getElementById('subject-title').textContent = 'שגיאה: לא נבחר מקצוע';
        return;
    }

    // קריאה לפונקציית שליפת הנתונים מהשרת
    fetchSubjectData(subjectId);
});

/**
 * פונקציה הפונה לשרת לשליפת חומרי הלימוד והצגתם
 * @param {string|number} subjectId מזהה המקצוע
 */
async function fetchSubjectData(subjectId) {
    try {
        // שליפת חומרי הלימוד לפי מזהה המקצוע
        const response = await fetch(`/api/materials/${subjectId}`);
        
        if (!response.ok) {
            throw new Error('שגיאה בטעינת חומרי הלימוד מהשרת');
        }

        const materials = await response.json();
        renderMaterialsList(materials);

        // שליפת רשימת כל המקצועות כדי להציג את כותרת ותיאור המקצוע הנוכחי
        const subjectsResponse = await fetch('/api/subjects');
        if (subjectsResponse.ok) {
            const subjects = await subjectsResponse.json();
            const currentSubject = subjects.find(s => s.id == subjectId || s._id == subjectId);
            renderSubjectDetails(currentSubject);
        }

    } catch (error) {
        console.error('שגיאה:', error);
        document.getElementById('subject-title').textContent = 'שגיאה בטעינת נתוני המקצוע';
    }
}

/**
 * הצגת פרטי המקצוע בראש העמוד
 */
function renderSubjectDetails(subject) {
    if (!subject) return;
    
    document.getElementById('subject-title').textContent = subject.name || 'ללא כותרת';
    document.getElementById('subject-description').textContent = subject.description || '';
}

/**
 * הצגת רשימת חומרי הלימוד במסך
 */
function renderMaterialsList(materials) {
    const listContainer = document.getElementById('materials-list');
    listContainer.innerHTML = ''; // איפוס הרשימה

    if (!materials || materials.length === 0) {
        listContainer.innerHTML = '<li>אין חומרי לימוד זמינים עבור מקצוע זה.</li>';
        return;
    }

    materials.forEach(material => {
        const listItem = document.createElement('li');
        listItem.className = 'material-item';

        const link = document.createElement('a');
        link.href = material.fileUrl || '#';
        link.textContent = material.title || 'חומר לימוד ללא שם';
        link.target = '_blank';

        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    });
}